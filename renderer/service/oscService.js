import OSC from 'osc-js';

const getPSType = (s) => {
  switch (s) {
    case 's':
      return 'OSCString';
    case 'i':
      return 'OSCInt';
    case 'f':
      return 'OSCFloat';
  }
};

class OscService {
  oscConn;
  alreadyOpen = false;

  constructor() {
    this.oscConn = new OSC({
      plugin: new OSC.DatagramPlugin(
          {send: {port: 3333}, open: {port: 4444}})
    });
  }

  open() {
    if (!this.alreadyOpen) {
      this.oscConn.open();
      this.alreadyOpen = true;
    }
  }

  close() {
    if (this.alreadyOpen) {
      this.oscConn.close();
      this.alreadyOpen = false;
    }
  }

  sendMessage(message) {
    try {
      const oscMessage = new OSC.Message(message.path, ...message.msg);
      const date = new Date();
      const oscBundle = new OSC.Bundle([oscMessage], date);
      this.oscConn.send(oscBundle);
    } catch (error) {
      console.error(error);
    }
  }

  handleMessage(path, messageCallback) {
    this.oscConn.on(path, function (msg) {
      const values = msg.args.map(function (val, i) {
        return {type: getPSType(msg.types[i + 1]), value: val}
      });
      const msgObj = {path: msg.address, msg: values};
      messageCallback(msgObj);
    });
  };
}

const oscService = new OscService();
export default oscService;
