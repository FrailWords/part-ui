import {Layout, Row} from 'antd';
import {useEffect, useRef, useState} from "react";
import Receiver from "./receiver";

const {
  Content,
} = Layout;

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


const ReceiversTab = ({receiver}) => {

  const [receiverMap, setReceiverMap] = useState({});

  useInterval(() => {
    Object.keys(receiverMap).forEach((key) => {
      receiverMap[key].connected = false;
    })
  }, 1000);

  useEffect(() => {
    if (receiver) {
      const receiverNumber = receiver[0];
      const receiverName = receiver[1];
      const vuValue1 = receiver[2];
      const vuValue2 = receiver[3];
      setReceiverMap({ ...receiverMap, [receiverNumber] : {
          name: receiverName,
          connected: true,
          vu1: vuValue1,
          vu2: vuValue2,
        }})
    }
  }, [receiver]);

  useEffect(() => {
    console.log(receiverMap);
  }, [receiverMap])

  return (
      <Content style={{padding: 10}}>
        <Row>
          {/*<Receiver receiver={receiverMap['sriram']} name={'Sriram'} />*/}
          {/*<Receiver receiver={receiverMap['sriram']} name={'Sriram'}/>*/}
          {/*<Receiver receiver={receiverMap['sriram']} name={'Sriram'}/>*/}
        </Row>
      </Content>
  )
}

export default ReceiversTab;
