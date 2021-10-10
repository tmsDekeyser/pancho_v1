//Checked after adding authentication
const { bc } = require('../local/local-copy');
const asyncHandler = require('../middleware/async');

const BlockExplorer = require('../blockchain/block-explorer');
const Wallet = require('../wallet/index');
const User = require('../models/User');

//helper functions

const walletInfoHelper = (address) => {
  return {
    address: address,
    balance: BlockExplorer.calculateBalance(bc, address),
    flow: BlockExplorer.calculateFlow(bc, address),
  };
};

//@description    Show Wallet-info logged in user
//@Route          GET api/v0/wallet/wallet-info
//@Visibiity      Private
exports.getWalletInfoMain = (req, res, next) => {
  res.json(walletInfoHelper(req.user.keys[1]));
};

//@description    Show wallet info of public address
//@Route          GET api/v0/wallet/wallet-info/:address
//@Visibiity      Public
exports.getWalletInfoByAddress = (req, res, next) => {
  res.json(walletInfoHelper(req.params.address));
};

//@description    Show user's contacts
//@Route          GET api/v0/wallet/contacts
//@Visibiity      Private
exports.getContactsMain = (req, res, next) => {
  res.json(JSON.parse(req.user.addressBook));
};

//@description    Show user's badges
//@Route          GET api/v0/wallet/badges/
//@Visibiity      Private
exports.getUserBadges = (req, res, next) => {
  const address = req.user.keys[1];

  res.json(BlockExplorer.badgeList(bc, address));
};

//@description    Show badges of public address
//@Route          GET api/v0/wallet/badges/:address
//@Visibiity      Public
exports.getBadgesByAddress = (req, res) =>
  res.json(BlockExplorer.badgeList(bc, req.params.address));

//@description    Save contacts as main node
//@Route          POST api/v0/wallet/contacts
//@Visibiity      Private
exports.postContactsMain = asyncHandler(async (req, res, next) => {
  const { address, alias } = req.body;
  if (!JSON.parse(req.user.addressBook)) {
    const addressBook = {};
  } else {
    addressBook = JSON.parse(req.user.addressBook);
  }

  addressBook[alias] = { address: address, alias: alias };

  const user = await User.findByIdAndUpdate(req.user._id, {
    addressBook: JSON.stringify(addressBook),
  });

  res.redirect('contacts');
});
