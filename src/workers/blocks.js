const { currentBlock, getBlock } = require('@utils/tron');
const dice = require('@workers/dice');
const wheel = require('@workers/wheel');

module.exports = async(io) => {
  let lastBlock = (await currentBlock()).block_header;

  setInterval(async() => {
    const current = await currentBlock() - 1;
    for (let number = lastBlock + 1; number <= current; number++) {
      const block = {
        number,
        hash: '0x' + (await getBlock(number)).blockID,
      };

      io.in('blocks').emit('blocks', block);

      dice(number, io);
      wheel(number, io);
    }
    lastBlock = current;
  }, 3000);
};
