import OSC from "osc-js";

const getPSType = (s) => {
  switch (s) {
    case "s":
      return "OSCString";
    case "i":
      return "OSCInt";
    case "f":
      return "OSCFloat";
  }
};

const OSC_SEND_PORT = 3333;
const OSC_RECEIVE_PORT = 4444;

class OscService {
  oscConn;
  alreadyOpen = false;

  constructor() {
    this.oscConn = new OSC({
      plugin: new OSC.DatagramPlugin({
        send: { port: OSC_SEND_PORT },
        open: { port: OSC_RECEIVE_PORT },
      }),
    });
  }

  open() {
    if (!this.alreadyOpen) {
      try {
        this.oscConn.open();
      } catch (_) {}
      this.alreadyOpen = true;
    }
  }

  close() {
    if (this.alreadyOpen) {
      try {
        this.oscConn.close();
      } catch (_) {}
      this.alreadyOpen = false;
    }
  }

  sendMessage = (path, value) => {
    const valueIsArray = Array.isArray(value);
    if ((valueIsArray && value[0] === "") || (!valueIsArray && value === ""))
      return;
    this._sendMessage({ path, msg: Array.isArray(value) ? value : [value] });
  };

  _sendMessage(message) {
    try {
      const oscMessage = new OSC.Message(message.path, ...message.msg);
      const date = new Date();
      const oscBundle = new OSC.Bundle([oscMessage], date);
      this.oscConn.send(oscBundle);
    } catch (_) {}
  }

  handleMessage(path, messageCallback) {
    this.oscConn.on(path, function (msg) {
      const values = msg.args.map(function (val, i) {
        return { type: getPSType(msg.types[i + 1]), value: val };
      });
      const msgObj = { path: msg.address, msg: values };
      messageCallback(msgObj);
    });
  }
}

const oscService = new OscService();
export default oscService;
