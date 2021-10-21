const fs = require('fs');
const path = require('path');

const asyncHandler = require('../middleware/async');
const BlockExplorer = require('../models/blockchain/block-explorer');
const User = require('../models/users/User');

const { bc, walletOptions } = require('../local/local-copy');
const P2P_PORT = process.env.P2P_PORT || 5001;

//helper functions

const walletInfoHelper = (address) => {
  return {
    address: address,
    balance: BlockExplorer.calculateBalance(bc, address),
    flow: BlockExplorer.calculateFlow(bc, address),
  };
};

//@description    Show Wallet-info logged in user
//@Route          GET api/v1/wallet/wallet-info
//@Visibiity      Private
exports.getWalletInfoMain = (req, res, next) => {
  res.json(walletInfoHelper(req.user.keys[1]));
};

//@description    Show wallet info of public address
//@Route          GET api/v1/wallet/wallet-info/:address
//@Visibiity      Public
exports.getWalletInfoByAddress = (req, res, next) => {
  res.json(walletInfoHelper(req.params.address));
};

//@description    Show user's contacts
//@Route          GET api/v1/wallet/contacts
//@Visibiity      Private
exports.getContactsMain = (req, res, next) => {
  res.json(JSON.parse(req.user.addressBook));
};

//@description    Show user's badges
//@Route          GET api/v1/wallet/badges/
//@Visibiity      Private
exports.getUserBadges = (req, res, next) => {
  const address = req.user.keys[1];

  res.json(BlockExplorer.badgeList(bc, address));
};

//@description    Show badges of public address
//@Route          GET api/v1/wallet/badges/:address
//@Visibiity      Public
exports.getBadgesByAddress = (req, res) =>
  res.json(BlockExplorer.badgeList(bc, req.params.address));

//@description    Save contacts as main node
//@Route          POST api/v1/wallet/contacts
//@Visibiity      Private
exports.postContactsMain = asyncHandler(async (req, res, next) => {
  const { address, alias } = req.body;
  let addressBook = {};
  if (JSON.parse(req.user.addressBook)) {
    addressBook = JSON.parse(req.user.addressBook);
  }

  addressBook[alias] = { address: address, alias: alias };

  if (!process.env.PEER) {
    const user = await User.findByIdAndUpdate(req.user._id, {
      addressBook: JSON.stringify(addressBook),
    });
  } else {
    const walletFile =
      process.env.NODE_ENV === 'production'
        ? 'walletJSON.txt'
        : `walletJSON_${P2P_PORT}.txt`;

    walletOptions.addressBook = addressBook;

    fs.writeFile(
      path.join(__dirname, walletFile),
      JSON.stringify(walletOptions),
      (err) => {
        if (err) throw err;
      }
    );
  }

  res.redirect('contacts');
});
