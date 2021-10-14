const { REWARD, REWARD_PTX } = require('../../../config/config');
const Transaction = require('../wallet/transaction');

class RewardTx extends Transaction {
  constructor(senderWallet, recipient, numTx) {
    super(senderWallet, recipient, REWARD_PTX * numTx);
    this.correct(numTx);
    this.signRewardTX(senderWallet);
  }

  correct(numTx) {
    this.input.balance = REWARD_PTX * numTx;
    this.input.type = 'REWARD';
    delete this.outputs['BLOCKCHAIN_BANK'];
  }

  //No corrected update function is necessary as there is only one Reward Tx per block

  signRewardTX(senderWallet) {
    this.input.signature = senderWallet.sign(Transaction.txHash(this.outputs));
  }
}

module.exports = RewardTx;
