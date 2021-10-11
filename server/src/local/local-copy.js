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

let walletFromFileOptions;
if (process.env.PEER) {
  console.log('Triggered reading');
  walletFromFileOptions = JSON.parse(
    fs.readFileSync(path.join(__dirname, `walletJSON_${P2P_PORT}.txt`))
  );

  if (!walletFromFileOptions.addressBook) {
    console.log('triggered writing');
    const wallet = new Wallet({ priv: null, pub: null, addressBook: {} }, bc);

    walletFromFileOptions = {
      priv: wallet.keyPair.getPrivate('hex'),
      pub: wallet.address,
      addressBook: wallet.addressBook,
    };

    fs.writeFile(
      path.join(__dirname, `walletJSON_${P2P_PORT}.txt`),
      JSON.stringify(walletFromFileOptions),
      (err) => {
        if (err) throw err;
      }
    );
  }
}

const walletOptions = process.env.PEER
  ? walletFromFileOptions
  : {
      priv: null,
      pub: null,
      addressBook: {},
    };

const wallet = new Wallet(
  {
    priv: walletOptions.priv,
    pub: walletOptions.pub,
    addressBook: walletOptions.addressBook,
  },
  bc
);

const mempool = new Mempool();
const p2pServer = new P2pServer(bc, mempool);
const miner = new Miner({ blockchain: bc, mempool, p2pServer, wallet });

module.exports = {
  bc,
  walletOptions,
  mempool,
  p2pServer,
  miner,
};
