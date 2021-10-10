const Websocket = require('ws');

const messageHandler = require('./p2pMessageHandler');
const { sendChain, sendAddress } = require('./p2pSendMessage');
const {
  broadcastChain,
  broadcastTransaction,
  broadcastNomination,
  broadcastRejection,
  broadcastClearTransactions,
} = require('./p2pBroadcast');

const { IP_BOOTSTRAP, IP_PEER } = require('../../../config/config');
const P2P_PORT = process.env.P2P_PORT || 5001;

class P2pServer {
  constructor(blockchain, mempool) {
    this.blockchain = blockchain;
    this.mempool = mempool;
    this.sockets = [];
    this.peers = P2P_PORT === 5001 ? [] : [`ws://${IP_BOOTSTRAP}:5001`];
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    // Initialise a websocket server
    server.on('connection', (socket, request) => {
      this.connectSocketAsServer(socket, request);

      socket.on('close', () => this.onCloseServerConnection(socket));
    });
    console.log(`Listening for peer connections on port ${P2P_PORT}`);

    //Connect to the Bootstrapping server
    this.connectToBootstrap();
  }

  //Connecting sockets

  connectSocketAsServer(socket, request) {
    let ip = request.socket.remoteAddress;
    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7);
    }
    //We store an additional key:value on the socket object
    //It will later store the websocket server port for peers connecting to the network
    socket.remotePeerServer = {
      address: ip,
      remotePort: request.socket.remotePort,
      wsServerPort: 0,
    };

    this.connectSocket(socket);
  }

  connectToBootstrap() {
    if (this.peers[0] === `ws://${IP_BOOTSTRAP}:5001`) {
      const socket = new Websocket(this.peers[0]);
      //This onOpen envent listener is when we connect to the bootstrapping Server as the client
      socket.on('open', () => {
        this.connectSocket(socket);
        sendAddress(socket);
      });

      socket.on('close', () => {
        //when bootstrap server goes down
        console.log('Closing client connection to bootstrap: ' + socket._url);
        console.log('Bootstrap server down, follow status and re-connect'.red);
        this.onClosePeerSocket(socket, `ws://${IP_BOOTSTRAP}:5001`);
      });
    }
  }

  connectToPeers(peers) {
    peers.forEach((peer) => {
      const socket = new Websocket(peer);

      socket.on('open', () => {
        this.connectSocket(socket);
        sendAddress(socket);
      });

      socket.on('close', () => {
        console.log('closing peer connection: ' + peer);
        this.onClosePeerSocket(socket, peer);
      });
    });
  }

  connectSocket(socket) {
    if (!this.sockets.find((s) => s === socket)) {
      this.sockets.push(socket);
      console.log('Socket connected');
      messageHandler(this.socket);

      sendChain(this, socket);
    }
  }

  //Close sockets helpers

  onCloseServerConnection(socket) {
    const peerToRemove = `ws://${
      this.sockets[this.sockets.indexOf(socket)].remotePeerServer.address
    }:${
      this.sockets[this.sockets.indexOf(socket)].remotePeerServer.wsServerPort
    }`;

    this.onClosePeerSocket(socket, peerToRemove);

    console.log('Closing client peer connection: ' + peerToRemove);
  }

  onClosePeerSocket(socket, peer) {
    this.peers = this.peers.filter((p) => p !== peer);
    this.sockets = this.sockets.filter((s) => s !== socket);
  }

  //Broadcast functions (loaded from external file but added as methods)
  broadcastChain = () => broadcastChain(this);
  broadcastTransaction = (transaction) =>
    broadcastTransaction(this, transaction);
  broadcastNomination = (nomination) => broadcastNomination(this, nomination);
  broadcastRejection = (nomId) => broadcastRejection(this, nomId);
  broadcastClearTransactions = () => broadcastClearTransactions(this);
}

module.exports = P2pServer;
