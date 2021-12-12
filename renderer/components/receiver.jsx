import {Col, Divider, Row, Slider, Switch, Tag} from 'antd';
import {useEffect, useRef, useState} from "react";
import oscService from "../service/oscService";
import {AudioMutedOutlined, AudioOutlined} from "@ant-design/icons"
import Text from "antd/lib/typography/Text";
import {VuMeter} from "./vuMeter";

const styles = {
  label: {fontWeight: 'bold'},
  muteButtonIcon: {fontSize: '150%', verticalAlign: 'middle', padding: '5px', alignItems: 'center'}
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

  const [vuValues, setVuValues] = useState([-85, -85]);
  const [connected, setConnected] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [receiverIndex, setReceiverIndex] = useState();
  const [receiverNumber, setReceiverNumber] = useState();
  const [mute, setMute] = useState(false);

  useEffect(() => {
    if (receiver) {
      setReceiverName(receiver.name);
      setReceiverIndex(receiver.index);
      setReceiverNumber(receiver.number);
      setVuValues([receiver.vu1, receiver.vu2]);
      setConnected(true);
    }
  }, [receiver]);

  const onMute = (value) => {
    oscService.sendMessage("/receiverMute", value ? [receiverNumber, receiverIndex, 1] : [receiverNumber, receiverIndex, 0]);
  }

  const onInputGainChange = (gain) => {
    oscService.sendMessage("/receiverLevel", [receiverNumber, receiverIndex, gain]);
  }

  const toggleMute = () => {
    onMute(!mute)
    setMute(!mute)
  }

  return (
      <Col span={12} style={{ padding: '20px'}}>
        <Divider orientation="left"/>
        <Row style={{ padding: '20px'}}>
          <Col flex={3}>
            <Row style={{display: 'flex', alignItems: 'center'}}>
              <Col span={10}>
                <Text style={styles.label}>Receiver Name</Text>
              </Col>
              <Col span={12}>
                <Text>{receiverName}</Text>
              </Col>
            </Row>
            <Row style={{display: 'flex', alignItems: 'center'}}>
              <Col span={10}>
                <Text style={styles.label}>Mute</Text>
              </Col>
              <Col span={12}>
                <Tag icon={mute ? <AudioMutedOutlined style={styles.muteButtonIcon} theme="outlined"/> :
                    <AudioOutlined style={styles.muteButtonIcon} theme="outlined"/>} onClick={toggleMute}
                     color={mute ? 'error' : 'success'}/>
              </Col>
            </Row>
            <Row style={{display: 'flex', alignItems: 'center'}}>
              <Col span={10}>
                <Text style={styles.label}>Receiver Mix Gain</Text>
              </Col>
              <Col span={12}>
                <Slider style={{marginLeft: 0}} onChange={onInputGainChange} defaultValue={30}/>
              </Col>
            </Row>
            <Row style={{display: 'flex', alignItems: 'center'}}>
              <Col span={10}>
                <Text style={styles.label}>Connected Status</Text>
              </Col>
              <Col span={12}>
                <Switch disabled
                        loading={!connected}
                        defaultChecked={false}
                        checked={connected}
                        checkedChildren={'Connected'}
                        unCheckedChildren={'Not Connected'}
                        size={'small'}
                />
              </Col>
            </Row>
          </Col>
          <Col flex={3}>
            {/*<VuMeter vu={vuValues}/>*/}
          </Col>
        </Row>
      </Col>
  )
}

export default Receiver;
