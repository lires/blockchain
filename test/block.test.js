const Block = require('../class/block');

describe('Block', () => {
  let data, lastBlock, block;

  beforeEach(() => {
    data = 'bar';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it('définit les données à égales aux données d\'entrée', () => {
    expect(block.data).toEqual(data);
  });

  it('définit le lastHash à égal au hash du block précédent', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it('génère un hash qui respecte la difficulté', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
  });

  it('diminue la difficulté pour un bloc généré lentement', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 30000)).toEqual(block.difficulty - 1);
  });

  it('augmente la difficulté pour un bloc généré rapidement', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
  });
});