const WebSocket = require('ws');
const PORT = 5001;
const peers = [];

class P2PServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new WebSocket.Server({ port: PORT });
    
    server.on('connection', socket => {
      this.connectSocket(socket);
    });

    this.connectToPeers();
    
    console.log(`Serveur P2P en écoute sur le port ${PORT}`);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new WebSocket(peer);
      
      socket.on('open', () => {
        this.connectSocket(socket);
      });
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connecté');

    this.messageHandler(socket);
    
    this.sendChain(socket);
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      console.log('Message reçu:', data);
      
      this.blockchain.replaceChain(data);
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChain() {
    this.sockets.forEach(socket => {
      this.sendChain(socket);
    });
  }
}

module.exports = P2PServer;