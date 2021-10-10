const MESSAGE_TYPES = {
  clearTransactions: 'CLEAR_TRANSACTIONS',
};

const {
  sendChain,
  sendTransaction,
  sendNomination,
  sendRejection,
} = require('./p2pSendMessage');

//broadcasting messages to all peers

function broadcastChain(p2pServer) {
  p2pServer.sockets.forEach((socket) => sendChain(p2pServer, socket));
}

function broadcastTransaction(p2pServer, transaction) {
  p2pServer.sockets.forEach((socket) => sendTransaction(socket, transaction));
}

function broadcastNomination(p2pServer, nomination) {
  p2pServer.sockets.forEach((socket) => sendNomination(socket, nomination));
}

function broadcastRejection(p2pServer, nomId) {
  p2pServer.sockets.forEach((socket) => sendRejection(socket, nomId));
}

function broadcastClearTransactions(p2pServer) {
  p2pServer.sockets.forEach((socket) =>
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.clearTransactions,
      })
    )
  );
}

module.exports = {
  broadcastChain,
  broadcastTransaction,
  broadcastNomination,
  broadcastRejection,
  broadcastClearTransactions,
};
