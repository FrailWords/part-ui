import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {Button, Col, Divider, Form, Input, Layout, Row, Select, Slider, Switch, Tabs, Card} from 'antd';
import oscService from "../service/oscService";

const {
  Content,
} = Layout;
const {Item: FormItem} = Form;
const {Option} = Select;

const {TabPane} = Tabs;

const Home = () => {

  const [connected, setConnected] = useState(false);

  oscService.handleMessage('/status', msgObj => {
    const allValues = msgObj.msg.map((m) => m.value + '');
    if (allValues.includes('off')) {
      setConnected(false)
    } else if (allValues.includes('running')) {
      setConnected(true);
    }
  });

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
    form.setFieldsValue({ mute: false });
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

        <Tabs defaultActiveKey="1" size={'large'} style={{padding: 40}}>
          <TabPane tab="Call Details" key="1">
            <Content style={{padding: 48}}>
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
                <FormItem
                    name='serverAddress'
                    label='Server Address'
                    labelCol={{span: 8}}
                    wrapperCol={{span: 8}}
                >
                  <Input size='large' disabled={connected} style={{width: 300}} name='ipAddress' onBlur={onServerChange}/>
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
                  <Input size='large' disabled={connected} style={{width: 300}} name='channelName' onBlur={onChannelNameChange}/>
                </FormItem>

                <FormItem
                    name='callName'
                    label='Call Name'
                    labelCol={{span: 8}}
                    wrapperCol={{span: 8}}
                >
                  <Input size='large' disabled={connected} style={{width: 300}} name='callName' onBlur={onCallNameChange}/>
                </FormItem>

                <Divider plain/>

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
                  <Switch onChange={onMute} />
                </FormItem>

                <FormItem
                    name='2x'
                    label='2X'
                    labelCol={{span: 8}}
                    wrapperCol={{span: 8}}
                    valuePropName="checked"
                >
                  <Switch onChange={on2XChange} />
                </FormItem>

                <FormItem
                    name='inputGain'
                    label='Normal Gain'
                    labelCol={{span: 8}}
                    wrapperCol={{span: 8}}
                >
                  <Slider onChange={onInputGainChange} />
                </FormItem>

                <Divider plain/>

                <FormItem
                    style={{marginTop: 48}}
                    wrapperCol={{span: 32, offset: 8}}
                >
                  <Button size='large' disabled={connected} type='primary' htmlType='submit'>
                    Connect
                  </Button>
                  <Button size='large' disabled={!connected} danger type='cancel' style={{marginLeft: 8}} htmlType="button" onClick={onDisconnect}>
                    Disconnect
                  </Button>
                  <Button size='large' disabled={connected} style={{marginLeft: 10}} htmlType="button" onClick={onReset}>
                    Reset
                  </Button>
                </FormItem>
              </Form>
            </Content>
            <Divider plain/>
            <Content style={{padding: 10}}>
              <Card title={'Server Status'}>
                <Row style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <Col span={10}>Connection Status</Col>
                  <Col span={10}>
                    <Switch disabled
                            loading={!connected}
                            defaultChecked={false}
                            checked={connected}
                            checkedChildren={'Connected'}
                            unCheckedChildren={'Not Connected'}
                            size={'large'}
                    />
                  </Col>
                </Row>
              </Card>
            </Content>
          </TabPane>
          <TabPane tab="Receivers" key="2">
          </TabPane>
        </Tabs>
      </React.Fragment>
  );
};

export default Home;
