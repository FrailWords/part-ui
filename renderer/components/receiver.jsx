import {Card, Col, Divider, Row, Slider, Switch, Tag} from 'antd';
import React, {useEffect, useRef, useState} from "react";
import oscService from "../service/oscService";
import {AudioMutedOutlined, AudioOutlined} from "@ant-design/icons"
import Text from "antd/lib/typography/Text";

const styles = {
  label: {fontWeight: 'bold'},
  muteButtonIcon: {fontSize: '150%', verticalAlign: 'middle', padding: '5px', alignItems: 'center'},
  receiverLabelRow: {display: 'flex', alignItems: 'center', padding: '10px'}
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Receiver = ({receiver}) => {

  const [connected, setConnected] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [receiverNumber, setReceiverNumber] = useState();
  const [mute, setMute] = useState(false);
  const [lastReceived, setLastReceived] = useState(Date.now());

  useEffect(() => {
    if (receiver) {
      setReceiverName(receiver.name);
      setReceiverNumber(receiver.number);
      setConnected(true);
      setLastReceived(Date.now())
    }
  }, [receiver]);

  useInterval(() => {
    const sinceLastReceived = (Date.now() - lastReceived) / 1000;
    if (sinceLastReceived >= 1) {
      setConnected(false);
    }
  }, 100);

  const onMute = (value) => {
    oscService.sendMessage("/receiverMute", value ? [receiverNumber, 1] : [receiverNumber, 0]);
  }

  const onInputGainChange = (gain) => {
    oscService.sendMessage("/receiverLevel", [receiverNumber, gain]);
  }

  const toggleMute = () => {
    onMute(!mute)
    setMute(!mute)
  }

  return (
      <Col span={24} style={{padding: '20px'}}>
        <Divider orientation="left"/>
        <Card title={`Receiver Name - ${receiverName}`}>
          <Row style={{padding: '10px'}}>
            <Col flex={3}>
              <Row style={styles.receiverLabelRow}>
                <Col span={10}>
                  <Text style={styles.label}>Mute</Text>
                </Col>
                <Col span={14}>
                  <Tag icon={mute ? <AudioMutedOutlined style={styles.muteButtonIcon} theme="outlined"/> :
                      <AudioOutlined style={styles.muteButtonIcon} theme="outlined"/>} onClick={toggleMute}
                       color={mute ? 'error' : 'success'}/>
                </Col>
              </Row>
              <Row style={styles.receiverLabelRow}>
                <Col span={10}>
                  <Text style={styles.label}>Receiver Mix Gain</Text>
                </Col>
                <Col span={14}>
                  <Slider style={{marginLeft: 0}} onChange={onInputGainChange} defaultValue={30}/>
                </Col>
              </Row>
              <Row style={styles.receiverLabelRow}>
                <Col span={10}>
                  <Text style={styles.label}>Connected Status</Text>
                </Col>
                <Col span={14}>
                  <Switch checked={connected} disabled title={connected ? 'Connected' : 'Not Connected'}/>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
  )
}

export default Receiver;
