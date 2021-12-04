import {Layout, Row} from 'antd';
import {useEffect, useState} from "react";
import Receiver from "./receiver";

const {
  Content,
} = Layout;

const ReceiversTab = ({receiver}) => {

  const [receiverMap, setReceiverMap] = useState({});

  useEffect(() => {
    if (receiver) {
      const receiverNumber = receiver[0];
      const receiverName = receiver[1];
      const connected = receiver[2];
      const vuValue1 = receiver[3];
      const vuValue2 = receiver[4];
      setReceiverMap({ [receiverNumber] : {
          name: receiverName,
          connected,
          vu1: vuValue1,
          vu2: vuValue2,
        }})
    }
  }, [receiver]);

  return (
      <Content style={{padding: 10}}>
        <Row>
          <Receiver receiver={receiverMap['test']} name={'Receiver1'} />
          <Receiver receiver={receiverMap['test']} name={'Receiver2'}/>
          <Receiver receiver={receiverMap['test']} name={'Receiver3'}/>
        </Row>
      </Content>
  )
}

export default ReceiversTab;
