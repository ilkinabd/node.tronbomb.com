const db = require('@db');
const {
  getEventResult, currentBlock, getBlock, toTRX, toDecimal, toBase58
} = require('@utils/tron');

let diceContract;

const diceEvents = async(blockNumber, io) => {
  const payload = await getEventResult(diceContract, {
    eventName: 'TakeBet',
    blockNumber,
  });

  for (const data of payload) {
    const {
      amount, tokenId, player, gameId, number, finishBlock, roll
    } = data.result;

    const event = {
      amount: (tokenId === '0') ? toTRX(amount) : toDecimal(amount),
      gameId: parseInt(gameId),
      number: parseInt(number),
      finishBlock: parseInt(finishBlock),
      tokenId: parseInt(tokenId),
      roll: parseInt(roll),
      player: toBase58(player),
    };

    io.in('dice').emit('dice', event);
  }
};

module.exports = async(io) => {
  let lastBlock = (await currentBlock()).block_header;
  diceContract = await db.contracts.get({ type: 'dice' });

  setInterval(async() => {
    const current = await currentBlock();
    for (let number = lastBlock + 1; number <= current; number++) {
      const block = {
        number,
        hash: (await getBlock(number)).blockID,
      };

      io.in('blocks').emit('blocks', block);
      diceEvents(number, io);
    }
    lastBlock = current;
  }, 1500);
};
