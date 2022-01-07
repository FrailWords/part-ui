import {Button, Col, Row, Slider, Switch} from "antd";
import React, {useEffect, useState} from "react";
import oscService from "../service/oscService";
import {ClearOutlined} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import {useInterval} from "../hooks/useInterval";

const styles = {
  label: { fontWeight: "bold" },
  muteButtonIcon: {
    fontSize: "150%",
    verticalAlign: "middle",
    padding: "5px",
    alignItems: "center",
  },
  receiverLabelRow: { display: "flex", alignItems: "center", padding: "5px" },
};

const Receiver = ({ receiver, connected }) => {
  const [mute, setMute] = useState(false);
  const [receiverNumber, setReceiverNumber] = useState();

  useEffect(() => {
    if (receiver) {
      setReceiverNumber(receiver.number);
    }
  }, [receiver]);

  const onMute = (mute) => {
    oscService.sendMessage(
      "/receiverMute",
      mute ? [receiverNumber, 1] : [receiverNumber, 0]
    );
  };

  const updateMute = muted => {
    onMute(muted);
    setMute(muted);
  };

  const toggleMute = (value) => {
    updateMute(value);
  };

  const onInputGainChange = (gain) => {
    oscService.sendMessage("/receiverLevel", [receiverNumber, gain]);
    setMute(false);
  };

  const onResetPackets = () => {
    oscService.sendMessage("/receiverPacketsReset", [receiverNumber, 1]);
  };

  return (
    <Row>
      <Col flex={3}>
        <Row style={styles.receiverLabelRow}>
          <Col span={10}>
            <Text style={styles.label}>Mute</Text>
          </Col>
          <Col span={14}>
            <Switch checked={mute} onChange={toggleMute} />
          </Col>
        </Row>
        <Row style={styles.receiverLabelRow}>
          <Col span={10}>
            <Text style={styles.label}>Receiver Mix Gain</Text>
          </Col>
          <Col span={14}>
            <Slider
              style={{ marginLeft: 0 }}
              onChange={onInputGainChange}
              defaultValue={30}
              disabled={!connected}
            />
          </Col>
        </Row>
        <Row style={styles.receiverLabelRow}>
          <Col span={10}>
            <Text style={styles.label}>Reset Packet Count</Text>
          </Col>
          <Col span={14}>
            <Button
              type="primary"
              icon={<ClearOutlined />}
              onClick={onResetPackets}
              disabled={!connected}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Receiver;
