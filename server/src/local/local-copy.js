const fs = require('fs');
const path = require('path');

const Blockchain = require('../models/blockchain');
const P2pServer = require('../models/p2p/p2pserver');
const Wallet = require('../models/wallet');
const Mempool = require('../models/wallet/mempool');
const Miner = require('../models/miner');

const P2P_PORT = process.env.P2P_PORT || 5001;

//On startup, we will either create a new blockchain or
//the one in storage, provided it is valid (checked by replaceChain fn)
const bc = new Blockchain();
const bcFromFile = JSON.parse(
  fs.readFileSync(path.join(__dirname, `blockchainJSON_${P2P_PORT}.txt`))
);

bc.replaceChain(bcFromFile.chain);

const wallet = new Wallet({ priv: null, pub: null, addressBook: {} }, bc);
const mempool = new Mempool();
const p2pServer = new P2pServer(bc, mempool);
const miner = new Miner({ blockchain: bc, mempool, p2pServer, wallet });

module.exports = {
  bc,
  wallet,
  mempool,
  p2pServer,
  miner,
};
