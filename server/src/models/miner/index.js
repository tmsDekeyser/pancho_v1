const fs = require('fs');
const path = require('path');

const Transaction = require('../wallet/transaction');
const BadgeTransaction = require('../wallet/badge-transaction');
const Wallet = require('../wallet');
const DividendTx = require('./dividend-transaction');
const RewardTx = require('./reward-transaction');
const BlockExplorer = require('../blockchain/block-explorer');

const P2P_PORT = process.env.P2P_PORT || 5001;

class Miner {
  constructor({ blockchain, wallet, mempool, p2pServer }) {
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.mempool = mempool;
    this.p2pServer = p2pServer;
  }

  mine() {
    //find valid transactions
    const validRtxs = this.validTransactions();
    const validBtxs = this.validBadgeTransactions();

    const validTxs = validRtxs.concat(validBtxs);

    //add reward and dividend Transaction

    const numTx = validTxs.length;
    const rewardTx = new RewardTx(
      Wallet.bankWallet(this.blockchain),
      this.wallet.address,
      numTx
    );
    validTxs.push(rewardTx);

    if (Miner.numberOfDividendRecipients(this.blockchain) > 0) {
      const dividendTx = new DividendTx(
        Wallet.bankWallet(this.blockchain),
        this.wallet.address,
        Miner.numberOfDividendRecipients(this.blockchain),
        numTx
      );

      Object.keys(BlockExplorer.knownAddresses(this.blockchain)).forEach(
        (recipient) => {
          dividendTx.update(
            Wallet.bankWallet(this.blockchain),
            recipient,
            numTx
          );
        }
      );
      validTxs.push(dividendTx);
    }

    // mine block, clear mempool and broadcast
    this.blockchain.addMinedBlock(validTxs);
    this.mempool.clearMempool();
    this.p2pServer.broadcastChain();
    this.p2pServer.broadcastClearTransactions();

    fs.writeFile(
      path.join(__dirname, `../../local/blockchainJSON_${P2P_PORT}.txt`),
      JSON.stringify(this.blockchain),
      (err) => {
        if (err) throw err;
      }
    );
  }

  validTransactions() {
    return this.mempool.transactions.filter((tx) => {
      return Transaction.verifyTx(tx, this.blockchain);
    });
  }

  validBadgeTransactions() {
    return this.mempool.badgeTransactions.filter((btx) => {
      return BadgeTransaction.verifyBtx(btx, this.blockchain);
    });
  }

  static numberOfDividendRecipients(blockchain) {
    const knownAddresses = BlockExplorer.knownAddresses(blockchain);
    return Object.keys(knownAddresses).length;
  }
}

module.exports = Miner;
