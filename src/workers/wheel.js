const { getEventResult } = require('@utils/tron');

const start = async(blockNumber, contract, io) => {
  const payload = await getEventResult(contract, {
    eventName: 'InitGame',
    blockNumber,
  });

  for (const data of payload) {
    const { finishBlock, gameId } = data.result;

    const event = {
      gameId: parseInt(gameId),
      finishBlock: parseInt(finishBlock),
    };

    io.in('wheel').emit('start', event);
  }
};

module.exports = {
  start,
};
