const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  nomination: 'NOMINATION',
  rejection: 'REJECTION',
  address: 'ADDRESS',
  peers: 'PEERS',
};

const P2P_PORT = process.env.P2P_PORT || 5001;

//Sending messages

function sendChain(p2pServer, socket) {
  socket.send(
    JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: p2pServer.blockchain.chain,
    })
  );
}

function sendAddress(socket) {
  console.log('sending address');
  let ip = socket._socket.address().address;
  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }

  socket.send(
    JSON.stringify({
      type: MESSAGE_TYPES.address,
      address: ip,
      port: P2P_PORT,
    })
  );
}

function sendPeers(socket, peers) {
  console.log('sending peers');
  socket.send(
    JSON.stringify({
      type: MESSAGE_TYPES.peers,
      peers,
    })
  );
}

function sendTransaction(socket, transaction) {
  socket.send(
    JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction,
    })
  );
}

function sendNomination(socket, nomination) {
  socket.send(
    JSON.stringify({
      type: MESSAGE_TYPES.nomination,
      nomination,
    })
  );
}

function sendRejection(socket, nomId) {
  socket.send(
    JSON.stringify({
      type: MESSAGE_TYPES.rejection,
      nomId,
    })
  );
}

module.exports = {
  sendChain,
  sendAddress,
  sendPeers,
  sendTransaction,
  sendNomination,
  sendRejection,
};
