import {Row} from 'antd';
import Receiver from "./receiver";

const ReceiversTab = ({receiver}) => {
  return (
      <Row>
        <Receiver receiver={receiver}/>
      </Row>
  )
}

export default ReceiversTab;
