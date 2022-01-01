import {Layout, Row} from 'antd';
import {useEffect, useRef, useState} from "react";
import oscService from "../service/oscService";
import Receiver from "./receiver";
import _ from "lodash";

const {
  Content,
} = Layout;



const ReceiversTab = ({receiver}) => {

  return (
      <Content style={{padding: 10}}>
        <Row>
          <Receiver receiver={receiver} />
        </Row>
      </Content>
  )
}

export default ReceiversTab;
