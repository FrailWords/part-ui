import { Button, Col, Row, Slider, Tag } from "antd";
import React, { useEffect, useState } from "react";
import oscService from "../service/oscService";
import {
  AudioMutedOutlined,
  AudioOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { useInterval } from "../hooks/useInterval";

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

const Receiver = ({ receiver, connected, onDisconnected }) => {
  const [receiverName, setReceiverName] = useState("");
  const [receiverNumber, setReceiverNumber] = useState();
  const [receivedTimestamp, setReceivedTimestamp] = useState();
  const [mute, setMute] = useState(false);

  useEffect(() => {
    if (receiver) {
      setReceiverName(receiver.name);
      setReceiverNumber(receiver.number);
      setReceivedTimestamp(receiver.timestamp);
    }
  }, [receiver]);

  useInterval(() => {
    const sinceLastReceived = (Date.now() - receivedTimestamp) / 1000;
    if (sinceLastReceived >= 1) {
      onDisconnected(receiverName);
    }
  }, 200);

  const onMute = (value) => {
    oscService.sendMessage(
      "/receiverMute",
      value ? [receiverNumber, 1] : [receiverNumber, 0]
    );
  };

  const onInputGainChange = (gain) => {
    oscService.sendMessage("/receiverLevel", [receiverNumber, gain]);
  };

  const onResetPackets = () => {
    oscService.sendMessage("/receiverPacketsReset", [receiverNumber, 1]);
  };

  const toggleMute = () => {
    onMute(!mute);
    setMute(!mute);
  };

  const getMuteIcon = () =>
    connected ? (
      <Tag
        icon={
          mute ? (
            <AudioMutedOutlined
              style={styles.muteButtonIcon}
              theme="outlined"
            />
          ) : (
            <AudioOutlined style={styles.muteButtonIcon} theme="outlined" />
          )
        }
        onClick={toggleMute}
        color={mute ? "error" : "success"}
      />
    ) : (
      <Text>--</Text>
    );

  return (
    <Row>
      <Col flex={3}>
        <Row style={styles.receiverLabelRow}>
          <Col span={10}>
            <Text style={styles.label}>Mute</Text>
          </Col>
          <Col span={14}>{getMuteIcon()}</Col>
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
