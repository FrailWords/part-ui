import OSC from 'osc-js';

class OscService {
  client;

  constructor() {
    this.client = new OSC({
      plugin: new OSC.DatagramPlugin({
        open: {host: "127.0.0.1", port: 4444},
        send: {host: "127.0.0.1", port: 3333},
      }),
    });
    this.client.open();
  }

  sendMessage(route, message) {
    try {
      console.log('sending message to route and message - ', route, message)
      this.client.send(new OSC.Message(route, message));
    } catch (error) {
      console.error(error);
    }
  }

  handleIncomingMessage() {

  }
}

const oscService = new OscService();
export default oscService;
