import {Col, Divider, Row, Slider, Switch, Tag} from 'antd';
import {useEffect, useState} from "react";
import oscService from "../service/oscService";
import {AudioMutedOutlined, AudioOutlined} from "@ant-design/icons"
import Text from "antd/lib/typography/Text";
import {VuMeter} from "./vuMeter";

const styles = {
  label: {fontWeight: 'bold'},
  muteButtonIcon: {fontSize: '150%', verticalAlign: 'middle', padding: '5px', alignItems: 'center'}
}

const Receiver = ({receiver, name}) => {

  const [vuValues, setVuValues] = useState([-40, -40]);
  const [connected, setConnected] = useState(false);
  const [mute, setMute] = useState(false);
  const [receiverNumber, setReceiverNumber] = useState(0);
  const [receiverName, setReceiverName] = useState(name);

  useEffect(() => {
  }, [receiver]);

  const onMute = (value) => {
    oscService.sendMessage("/mute", value ? [receiverNumber, 1] : [receiverNumber, 0]);
  }

  const onInputGainChange = (gain) => {
    oscService.sendMessage("/inputGain", [receiverNumber, gain]);
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
