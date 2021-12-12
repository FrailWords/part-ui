import {Layout, Row} from 'antd';
import {useEffect, useRef, useState} from "react";
import oscService from "../service/oscService";
import Receiver from "./receiver";
import _ from "lodash";

const {
  Content,
} = Layout;



const ReceiversTab = () => {

  const [receiverMap, setReceiverMap] = useState({});

  const messageCallback = (msgObj) => {
    const allValues = msgObj.msg.map((m) => m.value);
    console.log(allValues);
    const receiverNumber = allValues[0];
    const receiverName = allValues[1];
    const vuValue1 = allValues[2];
    const vuValue2 = allValues[3];
    setReceiverMap({
      ...receiverMap, [receiverName]: {
        name: receiverName,
        number: receiverNumber,
        vu1: vuValue1,
        vu2: vuValue2,
      }
    })
  };
  oscService.handleMessage('/receiver', _.debounce(messageCallback, 200));

  return (
      <Content style={{padding: 10}}>
        <Row>
          <Receiver receiver={receiverMap['sriram']} />
        </Row>
      </Content>
  )
}

export default ReceiversTab;
