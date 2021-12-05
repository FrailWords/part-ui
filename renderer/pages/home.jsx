import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {Button, Card, Col, Divider, Form, Input, Layout, Row, Select, Slider, Switch, Tabs} from 'antd';
import oscService from "../service/oscService";
import ReceiversTab from "../components/receivers_tab";

const {
  Content,
} = Layout;
const {Item: FormItem} = Form;
const {Option} = Select;

const {TabPane} = Tabs;

const Home = () => {

  const [connected, setConnected] = useState(false);

  oscService.handleMessage('*', msgObj => {
    const allValues = msgObj.msg.map((m) => m.value + '');
    if (msgObj.path === '/status') {
      if (allValues.includes('off')) {
        setConnected(false)
      } else if (allValues.includes('running')) {
        setConnected(true);
      }
      return
    }
    if (msgObj.path === '/receiver') {
      setReceiver(allValues);
    }
  });

  const [receiver, setReceiver] = useState();

  useEffect(() => {
    oscService.open();

    return () => {
      oscService.close();
    }
  }, []);

  const onFinish = (_) => {
    oscService.sendMessage("/call", 'true');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onNChanChange = (nchan) => {
    oscService.sendMessage("/nchan", parseInt(nchan));
  }

  const onBlockSizeChange = (blockSize) => {
    oscService.sendMessage("/blockSize", parseInt(blockSize));
  }

  const onInputGainChange = (gain) => {
    oscService.sendMessage("/inputGain", gain);
    form.setFieldsValue({mute: false});
  }

  const onServerChange = (server) => {
    oscService.sendMessage("/serverName", server.target.value);
  }

  const onChannelNameChange = (channel) => {
    oscService.sendMessage("/channelName", channel.target.value);
  }

  const onCallNameChange = (callName) => {
    oscService.sendMessage("/callName", callName.target.value);
  }

  const onPortChange = (port) => {
    oscService.sendMessage("/serverPort", parseInt(port.target.value));
  }

  const on2XChange = (value) => {
    oscService.sendMessage("/2x", value ? 1 : 0);
  }

  const onMute = (value) => {
    oscService.sendMessage("/mute", value ? 1 : 0);
  }

  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const onDisconnect = () => {
    oscService.sendMessage("/call", 'false');
  }

  return (
      <React.Fragment>
        <Head>
          <title>Musician Interface</title>
        </Head>

        <Row>
          <Col span={12}>
            <Content style={{padding: 10}}>
              <Form form={form} layout='horizontal'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={{
                      'serverAddress': 'localhost',
                      'serverPort': '38400',
                      'inputChannels': '2',
                      'blockSize': '64',
                      '2x': false,
                      'inputGain': 50,
                      'channelName': 'performance',
                      'callName': 'test',
                    }}>
                <Card title={'Call Details'}>
                  <FormItem
                      name='serverAddress'
                      label='Server Address'
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Input size='large' disabled={connected} style={{width: 300}} name='ipAddress'
                           onBlur={onServerChange}/>
                  </FormItem>

                  <FormItem
                      name='serverPort'
                      label='Port'
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Input size='large' disabled={connected} style={{width: 100}} name='port' onBlur={onPortChange}/>
                  </FormItem>

                  <FormItem
                      name='channelName'
                      label='Channel Name'
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Input size='large' disabled={connected} style={{width: 300}} name='channelName'
                           onBlur={onChannelNameChange}/>
                  </FormItem>

                  <FormItem
                      name='callName'
                      label='Call Name'
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Input size='large' disabled={connected} style={{width: 300}} name='callName'
                           onBlur={onCallNameChange}/>
                  </FormItem>

                  <FormItem
                      style={{marginTop: 48}}
                      wrapperCol={{span: 32, offset: 8}}
                  >
                    <Button size='large' danger={connected} type={connected ? 'cancel' : 'primary'} htmlType='submit'
                            shape='round' style={{width: "50%", fontWeight: 'bold'}}>
                      {!connected ? 'Connect' : 'Disconnect'}
                    </Button>
                  </FormItem>

                </Card>
                <Divider />
                <Card title={'Send Audio'}>
                  <FormItem
                      name='inputChannels'
                      label='Input Channels'
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Select size='small' style={{width: 100}} onSelect={onNChanChange}>
                      <Option value='0'>0</Option>
                      <Option value='1'>1</Option>
                      <Option value='2'>2</Option>
                    </Select>
                  </FormItem>

                  <FormItem
                      name='blockSize'
                      label='Block Size'
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                  >
                    <Select size='small' style={{width: 100}} onSelect={onBlockSizeChange}>
                      <Option value='0'>64</Option>
                      <Option value='1'>128</Option>
                      <Option value='2'>256</Option>
                    </Select>
                  </FormItem>

                  <FormItem
                      name='mute'
                      label='Mute'
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                      valuePropName="checked"
                  >
                    <Switch onChange={onMute}/>
                  </FormItem>

                  <FormItem
                      name='2x'
                      label='2X'
                      labelCol={{span: 8}}
                      wrapperCol={{span: 8}}
                      valuePropName="checked"
                  >
                    <Switch onChange={on2XChange} disabled/>
                  </FormItem>

                  <FormItem
                      name='inputGain'
                      label='Normal Gain'
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
              <ReceiversTab receiver={receiver}/>
            </Content>
          </Col>
        </Row>
      </React.Fragment>
  )
      ;
};

export default Home;
