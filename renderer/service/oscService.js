import OSC from 'osc-js';

export default class OscService {
  oscConn;

  constructor() {
    this.oscConn = new OSC({
      plugin: new OSC.DatagramPlugin(
          {send: {port: 3333}, open: {port: 4444}})
    });
    this.oscConn.open();
  }

  close() {
    this.oscConn.close();
  }

  sendMessage(message) {
    try {
      console.log('sending message - ', message)
      const oscMessage = new OSC.Message(message.path, ...message.msg);
      const date = new Date();
      const oscBundle = new OSC.Bundle([oscMessage], date);
      this.oscConn.send(oscBundle);
    } catch (error) {
      console.error(error);
    }
  }

  getPSType(s) {
    switch (s) {
      case 's':
        return 'OSCString';
      case 'i':
        return 'OSCInt';
      case 'f':
        return 'OSCFloat';
    }
  };

  handleMessage(path, messageCallback) {
    const that = this;
    this.oscConn.on(path, function (msg) {
      const values = msg.args.map(function (val, i) {
        return {type: that.getPSType(msg.types[i + 1]), value: val}
      });
      const msgObj = {path: msg.address, msg: values};
      messageCallback(msgObj);
    }.bind(this));
  };
}

