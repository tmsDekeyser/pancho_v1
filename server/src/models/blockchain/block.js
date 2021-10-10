const crypto = require('crypto');
const { DIFFICULTY, GENESIS_DATA } = require('../../../config/config');

class Block {
  constructor({ index, timestamp, lastHash, hash, nonce, data }) {
    this.index = index;
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.nonce = nonce;
    this.hash = hash;
    this.data = data;
  }

  static genesis() {
    const genesisBlock = new this(GENESIS_DATA);

    const { index, timestamp, lastHash, nonce, data } = genesisBlock;

    genesisBlock.hash = Block.blockHash({
      index,
      timestamp,
      lastHash,
      nonce,
      data,
    });

    return genesisBlock;
  }

  static mineBlock(prevBlock, data) {
    const index = prevBlock.index + 1;
    const lastHash = prevBlock.hash;
    const timestamp = Date.now();
    let nonce = 0;
    let hash;

    do {
      nonce++;
      hash = Block.blockHash({ index, timestamp, lastHash, nonce, data });
    } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

    return new this({ index, timestamp, lastHash, nonce, hash, data });
  }

  static blockHash({ index, timestamp, lastHash, nonce, data }) {
    const hash = crypto
      .createHash('sha256')
      .update(`${index}${timestamp}${lastHash}${nonce}${data}`)
      .digest('hex');

    return hash;
  }
}

module.exports = Block;
