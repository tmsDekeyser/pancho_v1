const fs = require('fs');

const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  nomination: 'NOMINATION',
  rejection: 'REJECTION',
  clearTransactions: 'CLEAR_TRANSACTIONS',
  address: 'ADDRESS',
  peers: 'PEERS',
};

function messageHandler(p2pServer, socket) {
  socket.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('data:', data);
    switch (data.type) {
      case MESSAGE_TYPES.chain:
        p2pServer.blockchain.replaceChain(data.chain);
        fs.writeFile(
          './local/blockchainJSON.txt',
          JSON.stringify(p2pServer.blockchain),
          (err) => {
            if (err) throw err;
            console.log('Writing blockchain to local file');
          }
        );
        break;
      case MESSAGE_TYPES.transaction:
        if (data.transaction.input.type === 'BADGE') {
          p2pServer.mempool.addBadgeTransaction(data.transaction);
        } else {
          p2pServer.mempool.addOrUpdateTransaction(data.transaction);
        }
        break;
      case MESSAGE_TYPES.nomination:
        p2pServer.mempool.addNomination(data.nomination);
        break;
      case MESSAGE_TYPES.rejection:
        p2pServer.mempool.removeNomination(data.nomId);
        break;
      case MESSAGE_TYPES.clearTransactions:
        p2pServer.mempool.clearMempool();
        break;
      case MESSAGE_TYPES.address:
        socket.remotePeerServer.wsServerPort = data.port;
        const fullIp = `ws://${data.address}:${data.port}`;
        if (!p2pServer.peers.find((peer) => peer === fullIp)) {
          p2pServer.peers.push(fullIp);
        }
        p2pServer.sockets.forEach((socket) =>
          p2pServer.sendPeers(socket, p2pServer.peers)
        );
        break;
      case MESSAGE_TYPES.peers:
        const newPeers = data.peers.filter((peer) => {
          return (
            !p2pServer.peers.find((knownPeer) => knownPeer === peer) &&
            peer !== `ws://${IP_PEER}:${P2P_PORT}`
          );
        });

        newPeers.forEach((peer) => p2pServer.peers.push(peer));

        p2pServer.connectToPeers(newPeers);
        break;
    }
  });
}

module.exports = messageHandler;
