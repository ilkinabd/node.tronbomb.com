const db = require('@db');
const { currentBlock, getBlock } = require('@utils/tron');
const dice = require('@workers/dice');

module.exports = async(io) => {
  let lastBlock = (await currentBlock()).block_header;
  const diceContract = await db.contracts.get({ type: 'dice' });

  setInterval(async() => {
    const current = await currentBlock();
    for (let number = lastBlock + 1; number <= current; number++) {
      const block = {
        number,
        hash: '0x' + (await getBlock(number)).blockID,
      };

      io.in('blocks').emit('blocks', block);
      dice.takePart(number, diceContract, io);
      dice.finish(number, diceContract, io);
      dice.reward(number, diceContract, io);
    }
    lastBlock = current;
  }, 1500);
};
