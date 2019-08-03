const { toBase58, toDecimal, toTRX } = require('@utils/tron');

const game = (payload) => {
  const {
    gameId, finishBlock, player, amount, tokenId, number, roll, result, status
  } = payload;

  if (toDecimal(finishBlock) === 0) return null;

  const model = {
    gameId: toDecimal(gameId),
    finishBlock: toDecimal(finishBlock),
    player: toBase58(player),
    amount: (tokenId === 0) ? toTRX(amount) : toDecimal(amount),
    tokenId,
    number,
    roll,
    result: (status === 0) ? null : result,
    status: (status === 0) ? 'start' : 'finish',
  };

  return model;
};

const params = (payload) => {
  const { portal, rtp, rtpDivider, minBet, maxBet } = payload;

  const model = {
    portal: toBase58(portal),
    rtp: rtp / rtpDivider,
    minBet: toTRX(minBet),
    maxBet: toTRX(maxBet),
  };

  return model;
};

const takeBets = (payload) => {
  const {
    player, amount, number, roll, tokenId, finishBlock, gameId
  } = payload;

  const model = {
    player: toBase58(player),
    amount: (tokenId === 0) ? toTRX(amount) : toDecimal(amount),
    number: toDecimal(number),
    roll: toDecimal(roll),
    tokenId: toDecimal(tokenId),
    finishBlock: toDecimal(finishBlock),
    gameId: toDecimal(gameId),
  };

  return model;
};

const finishGame = (payload) => {
  const { result, gameId } = payload;

  const model = {
    result: toDecimal(result),
    gameId: toDecimal(gameId),
  };

  return model;
};

module.exports = {
  game,
  params,
  takeBets,
  finishGame,
};
