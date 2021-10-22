const fs = require('fs');
const path = require('path');

const Blockchain = require('../models/blockchain');
const P2pServer = require('../models/p2p/p2pserver');
const Wallet = require('../models/wallet');
const Mempool = require('../models/wallet/mempool');
const Miner = require('../models/miner');

const PORT = process.env.HTTP_PORT || 3001;

//On startup, we will either create a new blockchain or
//the one in storage, provided it is valid (checked by replaceChain fn)
const bc = new Blockchain();
const bcFile =
  process.env.NODE_ENV === 'production'
    ? 'blockchainJSON.txt'
    : `blockchainJSON_${PORT}.txt`;

const bcFromFile = JSON.parse(fs.readFileSync(path.join(__dirname, bcFile)));

bc.replaceChain(bcFromFile.chain);

//Similarly, on startup we will check if there is a local file
//storing the options needed to recreate a wallet instance,
//i.e. the private and public keys, and the addressbook
//This is to make sure the node has the same address and keypair on every startup

let walletFromFileOptions;
const walletFile =
  process.env.NODE_ENV === 'production'
    ? 'walletJSON.txt'
    : `walletJSON_${PORT}.txt`;

walletFromFileOptions = JSON.parse(
  fs.readFileSync(path.join(__dirname, walletFile))
);

if (!walletFromFileOptions.priv) {
  const wallet = new Wallet({ priv: null, pub: null, addressBook: {} }, bc);

  walletFromFileOptions = {
    priv: wallet.keyPair.getPrivate('hex'),
    pub: wallet.address,
    addressBook: wallet.addressBook,
  };

  fs.writeFile(
    path.join(__dirname, walletFile),
    JSON.stringify(walletFromFileOptions),
    (err) => {
      if (err) throw err;
    }
  );
}

const walletOptions = walletFromFileOptions;

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
