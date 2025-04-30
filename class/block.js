const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(timestamp, lastHash, hash, data) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block ( \n timeStamp : ${this.timeStamp} \n Dernier Hash : ${this.lastHash.substring(0, 10)} \n Hash : ${this.hash.substring(0, 10)}... \n Data : ${JSON.stringify(this.data)} \n )`;
  }

  static genesis() {
    return new this('Genesis time', '-----', 'genesis-hash', []);
  }

  static mineBlock(lastBlock, data) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.hash(timestamp, lastHash, data);

    return new this(timestamp, lastHash, hash, data);
  }

  static hash(timestamp, lastHash, data) {
    return SHA256(`${timestamp}${lastHash}${JSON.stringify(data)}`).toString();
  }
}

module.exports = Block;
