const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const CryptoUtil = require('../../util/cryptoUtil');
const BlockExplorer = require('../blockchain/block-explorer');
const Nomination = require('./nomination');

class BadgeTransaction {
  constructor(senderWallet, nomination, payment) {
    this.id = uuidv4();
    this.input = {
      time: Date.now(),
      type: 'BADGE',
      address: senderWallet.address,
      nominationId: nomination.id,
      nominationSig: nomination.signature,
      signature: 'Unsigned',
    };
    this.nomination = nomination;
    this.outputs = {};
    this.outputs[senderWallet.address] = payment;
    this.outputs[nomination.data.address] = nomination.data.badge.amount;
  }

  static verifyBtx(btx, bc) {
    //check if sender and recipient are not the same
    const differentAddress = btx.nomination.data.address !== btx.input.address;

    // check if both signatures are valid
    const sig1Valid = CryptoUtil.verifySignature({
      publicKeyString: btx.nomination.data.address,
      data: Nomination.nomHash(btx.nomination.data),
      signature: btx.input.nominationSig,
    });

    const sig2Valid = CryptoUtil.verifySignature({
      publicKeyString: btx.input.address,
      data: BadgeTransaction.txHash(btx.outputs),
      signature: btx.input.signature,
    });

    //check if both have enough flow
    const senderFlow = BlockExplorer.calculateFlow(
      bc,
      btx.nomination.data.address
    );
    const recipientFlow = BlockExplorer.calculateFlow(bc, btx.input.address);

    const enoughFlow =
      senderFlow > btx.nomination.data.badge.amount &&
      recipientFlow > btx.outputs[btx.input.address];

    //check for negative amounts
    const noNegatives =
      0 <= btx.nomination.data.badge.amount &&
      0 < btx.outputs[btx.input.address];

    // check if the badge exists
    const badgeExists = Object.values(bc.chain[0].data).includes(
      btx.nomination.data.badge.badgeAddress
    );

    //check if amount from nomination matches
    const amountMatches =
      btx.nomination.data.badge.amount ===
      btx.outputs[btx.nomination.data.address];

    return (
      sig1Valid &&
      sig2Valid &&
      differentAddress &&
      badgeExists &&
      enoughFlow &&
      noNegatives &&
      amountMatches
    );
  }

  static txHash(outputs) {
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(outputs))
      .digest('hex');

    return hash;
  }
}

module.exports = BadgeTransaction;
