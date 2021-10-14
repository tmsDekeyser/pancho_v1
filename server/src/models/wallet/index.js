const colors = require('colors');
const CryptoUtil = require('../../util/cryptoUtil');

const Transaction = require('./transaction');
const Nomination = require('./nomination');
const BlockExplorer = require('../blockchain/block-explorer');
const BadgeTransaction = require('./badge-transaction');

const { NOM_MULTIPLIER } = require('../../../config/config');

class Wallet {
  constructor({ priv, pub, addressBook }, blockchain) {
    this.keyPair =
      priv && pub
        ? CryptoUtil.reGenKeyPair({ priv, pub })
        : CryptoUtil.genKeyPair();
    this.address = this.keyPair.getPublic().encode('hex');
    this.blockchain = blockchain;
    this.balance = this.calculateBalance();
    this.addressBook = addressBook;
  }

  toString() {
    return `Wallet -
        Address (public key): ${this.address.toString()},
        Balance: ${this.balance.toString()}
        Flow: ${BlockExplorer.calculateFlow(this.blockchain, this.address)}`;
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, mempool) {
    // Check balance, verify if enough
    const senderBalanceOnChain = this.calculateBalance();

    let tx = mempool.existingTransaction(this.address);
    console.log(tx);

    if (tx) {
      if (tx.outputs[this.address] < amount) {
        console.error('Not enough funds to complete transaction'.red);
        console.log(senderBalanceOnChain, tx.outputs[this.address], amount);
        return {
          success: false,
          error: 'Not enough funds to complete transaction',
        };
      } else {
        tx.updateTransaction(this, recipient, amount);
      }
    } else {
      if (senderBalanceOnChain < amount) {
        console.error('Not enough funds to complete transaction'.red);
        return {
          success: false,
          error: 'Not enough funds to complete transaction',
        };
      } else {
        tx = new Transaction(this, recipient, amount);
      }
    }
    //Sign transaction
    tx.input.signature = this.sign(Transaction.txHash(tx.outputs));
    return { success: true, tx };
  }

  nominate(badgeAddress, badgeRecipient, amount) {
    if (amount > this.calculateFlow()) {
      console.error('Not enough flow to spend'.red);
      return { success: false, error: 'Not enough flow to spend' };
    }

    const nomination = new Nomination(
      this,
      badgeAddress,
      badgeRecipient,
      amount
    );

    nomination.signature = this.sign(Nomination.nomHash(nomination.data));

    return { success: true, nomination };
  }

  createBadgeTransaction(nomination, amount) {
    if (nomination.data.badge.badgeRecipient !== this.address) {
      console.error('You are not nominated in this nomination'.red);
      return {
        success: false,
        error: 'You are not nominated in this nomination',
      };
    }

    if (amount > this.calculateFlow()) {
      console.error('You do not have enough flow to spend'.red);
      return { success: false, error: 'You do not have enough flow to spend' };
    }

    if (amount > nomination.data.badge.amount * NOM_MULTIPLIER) {
      console.error('Entered amount out of bounds'.red);
      return { success: false, error: 'Entered amount out of bounds' };
    }

    const btx = new BadgeTransaction(this, nomination, amount);
    btx.input.signature = this.sign(BadgeTransaction.txHash(btx.outputs));

    //console.log(btx);
    return { success: true, btx };
  }

  calculateBalance() {
    return BlockExplorer.calculateBalance(this.blockchain, this.address);
  }

  calculateFlow() {
    return BlockExplorer.calculateFlow(this.blockchain, this.address);
  }

  //Generates a (bank)wallet that hands out the mining rewards and dividend
  static bankWallet(blockchain) {
    const bankWallet = new this({ priv: null, pub: null }, blockchain);
    bankWallet.address = 'BLOCKCHAIN_BANK';
    return bankWallet;
  }
}

module.exports = Wallet;
