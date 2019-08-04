const { toDecimal, toBase58, toTRX } = require('@utils/tron');

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

const params = (payload) => {
  const { portal, duration, minBet, maxBet } = payload;

  const model = {
    portal: toBase58(portal),
    minBet: toTRX(minBet),
    maxBet: toTRX(maxBet),
    duration,
  };

  return model;
};

const bet = (payload) => {
  const { player, amount, tokenId, sector } = payload;

  const model = {
    player: toBase58(player),
    amount: (tokenId === 0) ? toTRX(amount) : toDecimal(amount),
    tokenId,
    sector,
  };

  return model;
};

module.exports = {
  game,
  params,
  bet,
};
