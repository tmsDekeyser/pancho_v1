const { DIVIDEND, DIVIDEND_PTX } = require('../../../config/config');
const Transaction = require('../wallet/transaction');

class DividendTx extends Transaction {
  constructor(senderWallet, recipient, numberOfDividendRecipients, numTx) {
    super(senderWallet, recipient, DIVIDEND_PTX * numTx);
    this.correct(recipient, numberOfDividendRecipients, numTx);
    this.signDividendTx(senderWallet);
  }

  correct(recipient, numberOfDividendRecipients, numTx) {
    //Input = DIVIDEND $ numberOfRecipients, so that input = output amounts
    //This way the tx verification passes
    this.input.balance = DIVIDEND_PTX * numTx * numberOfDividendRecipients;
    this.input.type = 'DIVIDEND';
    delete this.outputs[recipient];
    delete this.outputs['BLOCKCHAIN_BANK'];
  }

  update(senderwallet, recipient, numTx) {
    this.outputs[recipient] = DIVIDEND_PTX * numTx;
    this.signDividendTx(senderwallet);
  }

  signDividendTx(senderWallet) {
    this.input.signature = senderWallet.sign(Transaction.txHash(this.outputs));
  }
}

module.exports = DividendTx;
