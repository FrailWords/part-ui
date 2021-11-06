import React from 'react';
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

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

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
                      'serverAddress': 'netty.scottlmiller.net',
                      'serverPort': '38400',
                      'inputChannels': '2',
                      'blockSize': '64',
                      '2x': false,
                      'inputGain': 50,
                    }}>
                <FormItem
                    name='serverAddress'
                    label='Server Address'
                    labelCol={{span: 8}}
                    wrapperCol={{span: 8}}
                >
                  <Input size='large' style={{width: 300}} name='ipAddress'/>
                </FormItem>

                <FormItem
                    name='serverPort'
                    label='Port'
                    labelCol={{span: 8}}
                    wrapperCol={{span: 8}}
                >
                  <Input size='large' style={{width: 300}} name='port'/>
                </FormItem>

                <FormItem
                    name='inputChannels'
                    label='Input Channels'
                    labelCol={{span: 8}}
                    wrapperCol={{span: 8}}
                >
                  <Select size='small' style={{width: 100}}>
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
                  <Select size='small' style={{width: 100}}>
                    <Option value='64'>64</Option>
                    <Option value='128'>128</Option>
                    <Option value='256'>256</Option>
                  </Select>
                </FormItem>

                <FormItem
                    name='2x'
                    label='2X'
                    labelCol={{span: 8}}
                    wrapperCol={{span: 8}}
                    valuePropName="checked"
                >
                  <Switch onClick={() => {
                    oscService.sendMessage({path: '/message', msg: 'toggle'})
                  }} />
                </FormItem>

                <FormItem
                    name='inputGain'
                    label='Normal Gain'
                    labelCol={{span: 8}}
                    wrapperCol={{span: 8}}
                >
                  <Slider />
                </FormItem>

                <FormItem
                    style={{marginTop: 48}}
                    wrapperCol={{span: 8, offset: 8}}
                >
                  <Button size='large' type='primary' htmlType='submit'>
                    Connect
                  </Button>
                  <Button size='large' style={{marginLeft: 8}} htmlType="button" onClick={onReset}>
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
                  <Col span={4}>
                    <Switch loading
                            defaultChecked={false}
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
