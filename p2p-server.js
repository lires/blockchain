const WebSocket = require('ws');

const P2P_PORT = 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
    this.server = null;
  }

  listen() {
    this.server = new WebSocket.Server({ port: P2P_PORT });
    
    this.server.on('connection', socket => {
      this.connectSocket(socket);
    });

    this.connectToPeers();
    
    console.log(`P2P écoute le port ${P2P_PORT}`);
    
    return this.server;
  }

  close(callback) {
    if (this.server) {
      this.server.close(() => {
        console.log('P2P server closed');
        if (callback) callback();
      });
    } else if (callback) {
      callback();
    }
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