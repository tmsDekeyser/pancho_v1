const fs = require('fs');
const path = require('path');

const Blockchain = require('../blockchain');
const P2pServer = require('../p2pserver');
const Wallet = require('../wallet');
const Mempool = require('../wallet/mempool');
const Miner = require('../miner');

const bc = new Blockchain();
const bcFromFile = JSON.parse(fs.readFileSync('./local/blockchainJSON.txt'));

bc.replaceChain(bcFromFile.chain);

const wallet = new Wallet({ priv: null, pub: null, addressBook: {} }, bc);
const mempool = new Mempool();
const p2pServer = new P2pServer(bc, mempool);
const miner = new Miner({ blockchain: bc, mempool, p2pServer, wallet });

//stores wallets for SPV clients who do not run a full node
const walletMap = {};

module.exports = {
  bc,
  wallet,
  mempool,
  p2pServer,
  miner,
  walletMap,
};
