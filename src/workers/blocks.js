const db = require('@db');
const { currentBlock, getBlock } = require('@utils/tron');
const dice = require('@workers/dice');
const wheel = require('@workers/wheel');

module.exports = async(io) => {
  let lastBlock = (await currentBlock()).block_header;
  const diceContract = await db.contracts.get({ type: 'dice' });
  const wheelContract = await db.contracts.get({ type: 'wheel' });

  setInterval(async() => {
    const current = await currentBlock() - 1;
    for (let number = lastBlock + 1; number <= current; number++) {
      const block = {
        number,
        hash: '0x' + (await getBlock(number)).blockID,
      };

      io.in('blocks').emit('blocks', block);

      // Dice workers
      dice.takePart(number, diceContract, io);
      dice.finish(number, diceContract, io);
      dice.reward(number, diceContract, io);

      // Wheel workers
      wheel.start(number, wheelContract, io);
      wheel.takePart(number, wheelContract, io);
      wheel.finish(number, wheelContract, io);
      wheel.reward(number, wheelContract, io);
    }
    lastBlock = current;
  }, 3000);
};
