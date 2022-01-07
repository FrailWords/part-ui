import React, {useEffect, useState} from "react";
import Head from "next/head";
import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Slider,
  Switch,
  Typography,
} from "antd";
import oscService from "../service/oscService";
import _ from "lodash";
import Receiver from "../components/receiver";
import Store from "electron-store";
import {useInterval} from "../hooks/useInterval";

const {Content} = Layout;
const {Item: FormItem} = Form;
const {Option} = Select;
const {Panel} = Collapse;
const {Text} = Typography;

const store = new Store();

const Home = () => {
  const [connected, setConnected] = useState(false);
  const [receiverMap, setReceiverMap] = useState(new Map());

  oscService.handleMessage("/status", (msgObj) => {
    const allValues = msgObj.msg.map((m) => m.value + "");
    if (allValues.includes("off")) {
      setConnected(false);
    } else if (allValues.includes("running")) {
      setConnected(true);
    }
  });

  const updateMap = React.useCallback((k, v) => {
    setReceiverMap(new Map(receiverMap.set(k, v)));
  }, []);

  const updateReceivers = React.useCallback((allValues) => {
    const receiverNumber = allValues[0];
    const receiverName = allValues[1];
    const key = `${receiverName}-${receiverNumber}`
    if (receiverMap.has(key)) {
      updateMap(key, {
        ...receiverMap.get(key),
        timestamp: Date.now()
      })
    } else {
      updateMap(key, {
        name: receiverName,
        number: receiverNumber,
        timestamp: Date.now(),
        connected: true,
      })
    }
  }, [])


  const messageCallback = (msgObj) => {
    updateReceivers(msgObj.msg.map((m) => m.value))
  };

  oscService.handleMessage("/receiver", _.debounce(messageCallback, 200));

  useEffect(() => {
    oscService.open();

    return () => {
      oscService.close();
    };
  }, []);

  useInterval(() => {
    const keys = receiverMap.keys();
    [...keys].map((key) => {
      const receiver = receiverMap.get(key);
      const sinceLastReceived = (Date.now() - receiver.timestamp) / 1000; // convert to seconds
      if (sinceLastReceived >= 3 && receiver.connected) {
        updateMap(key, {
          ...receiverMap.get(key),
          connected: false,
        })
      }
    })
  }, 2000);

  const getExtra = (key) => {
    const receiver = receiverMap.get(key);
    return receiver.connected ? (
        <Text type="success">Connected</Text>
    ) : (
        <Text type="danger">Not Connected</Text>
    );
  };

  const onFinish = (_) => {
    oscService.sendMessage("/call", !connected + "");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onNChanChange = (nchan) => {
    oscService.sendMessage("/nchan", parseInt(nchan));
  };

  const onInputGainChange = (gain) => {
    oscService.sendMessage("/inputGain", gain);
    form.setFieldsValue({mute: false});
  };

  const onServerChange = (server) => {
    oscService.sendMessage("/serverName", server.target.value);
  };

  const onChannelNameChange = (channel) => {
    oscService.sendMessage("/channelName", channel.target.value);
  };

  const onCallNameChange = (callName) => {
    oscService.sendMessage("/callName", callName.target.value);
  };

  const onPortChange = (port) => {
    oscService.sendMessage("/serverPort", parseInt(port.target.value));
  };

  const onMute = (value) => {
    oscService.sendMessage("/mute", value ? 1 : 0);
  };

  const [form] = Form.useForm();

  const refreshSettings = () => {
    const settings = store.get("settings");
    if (settings) {
      oscService.sendMessage("/nchan", parseInt(settings["inputChannels"]));
      oscService.sendMessage("/inputGain", settings["inputGain"]);
      oscService.sendMessage("/serverName", settings["serverAddress"]);
      oscService.sendMessage("/channelName", settings["channelName"]);
      oscService.sendMessage("/callName", settings["callName"]);
      oscService.sendMessage("/serverPort", parseInt(settings["serverPort"]));
      form.setFieldsValue(settings)
    } else {
      store.set({
        settings: {
          inputChannels: "2",
          inputGain: 50,
          serverAddress: "server-address",
          channelName: "channel-name",
          callName: "call-name",
          serverPort: 38400
        }
      })
    }
  };

  useEffect(() => {
    //on load, send all values from settings
    refreshSettings();
  }, []);

  return (
      <React.Fragment>
        <Head>
          <title>Musician Interface</title>
        </Head>

        <Row>
          <Col span={12}>
            <Content style={{padding: 10}}>
              <Form
                  form={form}
                  layout="horizontal"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
              >
                <Card
                    title={"Call Details"}
                    extra={
                      <Button
                          size="large"
                          type={"default"}
                          shape="round"
                          style={{fontWeight: "bold"}}
                          onClick={() => store.openInEditor()}
                          disabled={connected}
                      >
                        Edit Settings
                      </Button>
                    }
                >
                  <FormItem
                      name="serverAddress"
                      label="Server Address"
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Input
                        size="large"
                        disabled={connected}
                        style={{width: 300}}
                        name="ipAddress"
                        onBlur={onServerChange}
                    />
                  </FormItem>

                  <FormItem
                      name="serverPort"
                      label="Port"
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Input
                        size="large"
                        disabled={connected}
                        style={{width: 100}}
                        name="port"
                        onBlur={onPortChange}
                    />
                  </FormItem>

                  <FormItem
                      name="channelName"
                      label="Channel Name"
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Input
                        size="large"
                        disabled={connected}
                        style={{width: 300}}
                        name="channelName"
                        onBlur={onChannelNameChange}
                    />
                  </FormItem>

                  <FormItem
                      name="callName"
                      label="Call Name"
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Input
                        size="large"
                        disabled={connected}
                        style={{width: 300}}
                        name="callName"
                        onBlur={onCallNameChange}
                    />
                  </FormItem>

                  <FormItem
                      style={{marginTop: 48}}
                      wrapperCol={{span: 32, offset: 8}}
                  >
                    <Button
                        size="large"
                        danger={connected}
                        type={connected ? "cancel" : "primary"}
                        htmlType="submit"
                        shape="round"
                        style={{width: "50%", fontWeight: "bold"}}
                    >
                      {!connected ? "Connect" : "Disconnect"}
                    </Button>
                  </FormItem>
                </Card>
                <Divider/>
                <Card title={"Send Audio"}>
                  <FormItem
                      name="inputChannels"
                      label="Input Channels"
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Select
                        size="small"
                        style={{width: 100}}
                        onSelect={onNChanChange}
                    >
                      <Option value="0">0</Option>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                    </Select>
                  </FormItem>

                  <FormItem
                      name="mute"
                      label="Mute"
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                      valuePropName="checked"
                  >
                    <Switch onChange={onMute}/>
                  </FormItem>
                  <FormItem
                      name="inputGain"
                      label="Normal Gain"
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Slider onChange={onInputGainChange}/>
                  </FormItem>
                </Card>
              </Form>
            </Content>
          </Col>
          <Col span={12}>
            <Content style={{padding: 10}}>
              <Collapse>
                {[...receiverMap.keys()].map((key) => (
                    <Panel
                        header={`Receiver: ${key}`}
                        bordered
                        key={key}
                        extra={getExtra(key)}
                    >
                      <Receiver
                          key={key}
                          receiver={receiverMap.get(key)}
                      />
                    </Panel>
                ))}
              </Collapse>
            </Content>
          </Col>
        </Row>
      </React.Fragment>
  );
};

export default Home;
