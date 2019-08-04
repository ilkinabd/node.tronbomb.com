const { toDecimal } = require('@utils/tron');

const game = (payload) => {
  const { gameId, finishBlock, betsCount, result, status } = payload;

  if (toDecimal(finishBlock) === 0) return null;

  let statusType;
  switch (status) {
    case 0: statusType = 'empty'; break;
    case 1: statusType = 'start'; break;
    case 2: statusType = 'finish'; break;
  }

  const model = {
    gameId: toDecimal(gameId),
    finishBlock: toDecimal(finishBlock),
    betsCount: toDecimal(betsCount),
    result: (status === 0) ? null : result,
    status: statusType,
  };

  return model;
};

module.exports = {
  game,
};
