const utils = require('@utils/tron');

module.exports = async(io) => {
  let lastBlock = (await utils.currentBlock()).block_header;

  setInterval(async() => {
    const currentBlock = await utils.currentBlock();
    for (let i = lastBlock + 1; i <= currentBlock; i++) {
      io.in('blocks').emit('blocks', {
        number: i,
        hash: (await utils.block(i)).blockID,
      });
    }
    lastBlock = currentBlock;
  }, 1000);
};
