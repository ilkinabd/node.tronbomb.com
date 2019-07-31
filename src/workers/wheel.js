const { getEventResult, toTRX, toDecimal, toBase58 } = require('@utils/tron');

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

const takePart = async(blockNumber, contract, io) => {
  const payload = await getEventResult(contract, {
    eventName: 'TakeBet',
    blockNumber,
  });

  for (const data of payload) {
    const { amount, tokenId, player, gameId, sector } = data.result;

    const event = {
      bet: (tokenId === '0') ? toTRX(amount) : toDecimal(amount),
      index: parseInt(gameId),
      sector: parseInt(sector),
      tokenId: parseInt(tokenId),
      wallet: toBase58(player),
    };

    io.in('wheel').emit('take-part', event);
  }
};

const finish = async(blockNumber, contract, io) => {
  const payload = await getEventResult(contract, {
    eventName: 'FinishGame',
    blockNumber,
  });

  for (const data of payload) {
    const { result, gameId } = data.result;

    const event = {
      gameId: parseInt(gameId),
      result: parseInt(result),
    };

    io.in('wheel').emit('finish', event);
  }
};

module.exports = {
  start,
  takePart,
  finish,
};
