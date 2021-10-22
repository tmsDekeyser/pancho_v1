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

const { IP_BOOTSTRAP } = require('../../../config/config');
const WS_BOOTSTRAP =
  process.env.NODE_ENV === 'production'
    ? `ws://${IP_BOOTSTRAP}`
    : `ws://${IP_BOOTSTRAP}:3001`;
// const PORT = process.env.PORT || 3001;

class P2pServer {
  constructor(blockchain, mempool) {
    this.blockchain = blockchain;
    this.mempool = mempool;
    this.sockets = [];
    //Here we should check if we are the bootstrapping server or not.
    this.peers = process.env.PEER ? [WS_BOOTSTRAP] : [];
  }

  startup() {
    const wsServer = new Websocket.Server({ noServer: true });
    // Initialise a websocket server
    wsServer.on('connection', (socket, request) => {
      this.connectSocketAsServer(socket, request);

      socket.on('close', () => this.onCloseServerConnection(socket));
    });
    console.log(`Listening for peer connections`);

    //Connect to the Bootstrapping server
    this.connectToBootstrap();

    return wsServer;
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
    if (this.peers[0] === WS_BOOTSTRAP) {
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
        this.onClosePeerSocket(socket, WS_BOOTSTRAP);
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
      messageHandler(this, socket);

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
