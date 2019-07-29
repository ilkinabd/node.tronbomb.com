const { getEventResult, toTRX, toDecimal, toBase58 } = require('@utils/tron');

const takePart = async(blockNumber, diceContract, io) => {
  const payload = await getEventResult(diceContract, {
    eventName: 'TakeBet',
    blockNumber,
  });

  for (const data of payload) {
    const {
      amount, tokenId, player, gameId, number, finishBlock, roll
    } = data.result;

    const event = {
      bet: (tokenId === '0') ? toTRX(amount) : toDecimal(amount),
      index: parseInt(gameId),
      number: parseInt(number),
      finishBlock: parseInt(finishBlock),
      tokenId: parseInt(tokenId),
      roll: parseInt(roll),
      wallet: toBase58(player),
    };

    io.in('dice').emit('take-part', event);
  }
};

const finish = async(blockNumber, diceContract, io) => {
  const payload = await getEventResult(diceContract, {
    eventName: 'FinishGame',
    blockNumber,
  });

  for (const data of payload) {
    const { result, gameId } = data.result;

    const event = {
      gameId: parseInt(gameId),
      result: parseInt(result),
    };

    io.in('dice').emit('finish', event);
  }
};

const reward = async(blockNumber, diceContract, io) => {
  const payload = await getEventResult(diceContract, {
    eventName: 'PlayerWin',
    blockNumber,
  });

  for (const data of payload) {
    const { gameId, amount, tokenId, player } = data.result;

    const event = {
      amount: (tokenId === '0') ? toTRX(amount) : toDecimal(amount),
      wallet: toBase58(player),
      tokenId: parseInt(tokenId),
      gameId: parseInt(gameId),
    };

    io.in('dice').emit('reward', event);
  }
};

module.exports = {
  takePart,
  finish,
  reward,
};
