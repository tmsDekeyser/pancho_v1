const asyncHandler = require('../middleware/async');
const Wallet = require('../models/wallet/index');
const BlockExplorer = require('../models/blockchain/block-explorer');
const ErrorResponse = require('../util/errorResponse');

const { bc, mempool, p2pServer, miner } = require('../local/local-copy');

//Helper functions

const createUserWallet = (req) => {
  const priv = req.user.keys[0];
  const pub = req.user.keys[1];
  const addressBook = JSON.parse(req.user.addressBook);

  return new Wallet({ priv, pub, addressBook }, bc);
};

const findContact = (wallet, input) => {
  const foundContact = Object.values(wallet.addressBook).find(
    (item) => item.alias === input
  );
  return foundContact ? foundContact.address : input;
};

//------------|
//***Routes***|
//------------|

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
exports.postTransactionMain = (req, res, next) => {
  const { amount } = req.body;
  let { recipient } = req.body;

  if (amount <= 0) {
    return next(new ErrorResponse('Enter a valid amount', 400));
  }

  const userWallet = createUserWallet(req);
  recipient = findContact(userWallet, recipient);

  if (recipient === userWallet.address) {
    return next(new ErrorResponse('You cannot send tokens to yourself', 400));
  }

  const createTxResp = userWallet.createTransaction(recipient, amount, mempool);

  if (createTxResp.success) {
    const { tx } = createTxResp;
    mempool.addOrUpdateTransaction(tx);
    p2pServer.broadcastTransaction(tx);
  } else {
    return next(new ErrorResponse(createTxResp.error, 400));
  }
  res.redirect('mempool');
};

//@description    Nominate user for badge
//@Route          POST api/v1/p2p/nominate
//@Visibiity      Private
exports.nominateMain = asyncHandler(async (req, res, next) => {
  const { badgeAddress, amount } = req.body;
  let { badgeRecipient } = req.body;

  if (amount <= 0) {
    return next(new ErrorResponse('Enter a valid amount', 400));
  }

  const badgeFound = BlockExplorer.allBadges(bc).find(
    (bAdd) => bAdd === badgeAddress
  );

  if (!badgeFound) {
    return next(new ErrorResponse('Badge not found', 400));
  }

  const userWallet = createUserWallet(req);
  badgeRecipient = findContact(userWallet, badgeRecipient);

  if (badgeRecipient === userWallet.address) {
    return next(new ErrorResponse('You cannot send tokens to yourself', 400));
  }

  const nominateResp = userWallet.nominate(
    badgeAddress,
    badgeRecipient,
    amount
  );

  if (!nominateResp.success) {
    return next(new ErrorResponse(nominateResp.error, 400));
  } else {
    const { nomination } = nominateResp;
    mempool.addNomination(nomination);
    p2pServer.broadcastNomination(nomination);
    res.redirect('mempool');
  }
});

//@description    Accept or reject nomination
//@Route          POST api/v1/p2p/nomination-decision
//@Visibiity      Private
exports.nominationDecision = asyncHandler(async (req, res, next) => {
  const { nomId, accept, amount } = req.body;

  if (accept) {
    if (amount < 0) {
      return next(new ErrorResponse('Enter a valid amount', 400));
    }

    const nomination = mempool.findNominationById(nomId);

    if (!nomination) {
      return next(
        new ErrorResponse('Cannot find nomination with this ID', 400)
      );
    }

    const badgeFound = BlockExplorer.allBadges(bc).find(
      (bAdd) => bAdd === nomination.data.badge.badgeAddress
    );

    if (!badgeFound) {
      return next(new ErrorResponse('Badge from nomination not found', 400));
    }

    const userWallet = createUserWallet(req);
    const createBtxResp = userWallet.createBadgeTransaction(nomination, amount);

    if (!createBtxResp.success) {
      return next(new ErrorResponse(createBtxResp.error, 400));
    } else {
      const { btx } = createBtxResp;
      mempool.addBadgeTransaction(btx);
      p2pServer.broadcastTransaction(btx);
    }
  }

  mempool.removeNomination(nomId);
  p2pServer.broadcastRejection(nomId);
  res.redirect('mempool');
});
