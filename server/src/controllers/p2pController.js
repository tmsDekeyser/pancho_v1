const asyncHandler = require('../middleware/async');
const Wallet = require('../models/wallet/index');
const BlockExplorer = require('../models/blockchain/block-explorer');
const ErrorResponse = require('../util/errorResponse');

const { bc, mempool, p2pServer, miner } = require('../local/local-copy');

const findContact = (wallet, input) => {
  const foundContact = Object.values(wallet.addressBook).find(
    (item) => item.alias === input
  );
  return foundContact ? foundContact.address : input;
};

//@description    Show Blockchain
//@Route          GET api/v1/p2p/blocks
//@Visibiity      Public
exports.getBlocks = (req, res, next) => {
  res.json(bc.chain);
};

//@description    Show Mempool
//@Route          GET api/v1/p2p/mempool
//@Visibiity      Public
exports.getMempool = (req, res, next) => {
  res.json(mempool);
};

//@description    Show Known addresses on blockchain
//@Route          GET api/v1/p2p/known-addresses
//@Visibiity      Public
exports.getKnownAddresses = (req, res, next) => {
  res.json(BlockExplorer.knownAddresses(bc));
};

//@description    Show Connected peers
//@Route          GET api/v1/p2p/peers
//@Visibiity      Private + role === peer || admin
exports.getPeers = (req, res, next) => {
  res.json(p2pServer.peers);
};

//@description    Mine a block
//@Route          POST api/v1/p2p/mine
//@Visibiity      Private + role === admin or peer
exports.mineBlock = (req, res, next) => {
  miner.mine();
  res.redirect('blocks');
};

//@description    Send transaction request to main node
//@Route          POST api/v1/p2p/transact
//@Visibiity      Private
exports.postTransactionMain = asyncHandler(async (req, res, next) => {
  const priv = req.user.keys[0];
  const pub = req.user.keys[1];
  const addressBook = JSON.parse(req.user.addressBook);

  const userWallet = new Wallet({ priv, pub, addressBook }, bc);

  const { amount } = req.body;
  let { recipient } = req.body;

  recipient = findContact(userWallet, recipient);

  try {
    const tx = userWallet.createTransaction(recipient, amount, mempool);

    if (tx) {
      mempool.addOrUpdateTransaction(tx);
      p2pServer.broadcastTransaction(tx);
    }
    res.redirect('mempool');
  } catch (error) {
    next(error);
  }
});

//@description    Nominate user for badge
//@Route          POST api/v1/p2p/nominate
//@Visibiity      Private
exports.nominateMain = asyncHandler(async (req, res, next) => {
  const priv = req.user.keys[0];
  const pub = req.user.keys[1];
  const addressBook = JSON.parse(req.user.addressBook);

  const userWallet = new Wallet({ priv, pub, addressBook }, bc);

  const { badgeAddress, amount } = req.body;
  let { badgeRecipient } = req.body;

  badgeRecipient = findContact(userWallet, badgeRecipient);

  try {
    const nomination = userWallet.nominate(
      badgeAddress,
      badgeRecipient,
      amount
    );

    mempool.addNomination(nomination);
    p2pServer.broadcastNomination(nomination);
    res.redirect('mempool');
  } catch (error) {
    next(error);
  }
});

//@description    Accept or reject nomination
//@Route          POST api/v1/p2p/nomination-decision
//@Visibiity      Private
exports.nominationDecision = asyncHandler(async (req, res, next) => {
  const priv = req.user.keys[0];
  const pub = req.user.keys[1];
  const { addressBook } = req.user;

  const { nomId, accept, amount } = req.body;

  const nomination = mempool.findNominationById(nomId);

  try {
    if (accept) {
      const userWallet = new Wallet({ priv, pub, addressBook }, bc);
      const btx = userWallet.createBadgeTransaction(nomination, amount);

      if (!btx) {
        return next(new ErrorResponse('Bad request', 400));
      }

      mempool.addBadgeTransaction(btx);
      p2pServer.broadcastTransaction(btx);
    }
    mempool.removeNomination(nomId);
    p2pServer.broadcastRejection(nomId);
    res.redirect('mempool');
  } catch (error) {
    next(error);
  }
});
