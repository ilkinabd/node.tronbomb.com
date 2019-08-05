const { toBase58, toDecimal, toTRX } = require('@utils/tron');

const rollType = (index) => {
  let roll;
  switch (index) {
    case 0: roll = 'under'; break;
    case 1: roll = 'over'; break;
    case 2: roll = 'exact'; break;
  }
  return roll;
};

const toAmount = (tokenId, amount) =>
  ((toDecimal(tokenId) === 0) ? toTRX(amount) : toDecimal(amount));

const game = (payload) => {
  const {
    gameId, finishBlock, player, amount, tokenId, number, roll, result, status
  } = payload;

  if (toDecimal(finishBlock) === 0) return null;

  const model = {
    gameId: toDecimal(gameId),
    finishBlock: toDecimal(finishBlock),
    player: toBase58(player),
    amount: toAmount(tokenId, amount),
    tokenId,
    number,
    roll: rollType(roll),
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
    wallet: toBase58(player),
    bet: toAmount(tokenId, amount),
    number: toDecimal(number),
    roll: rollType(toDecimal(roll)),
    tokenId: toDecimal(tokenId),
    finishBlock: toDecimal(finishBlock),
    index: toDecimal(gameId),
  };

  return model;
};

const finishGame = (payload) => {
  const { result, gameId } = payload;

  const model = {
    result: toDecimal(result),
    index: toDecimal(gameId),
  };

  return model;
};

const playerWin = (payload) => {
  const { player, amount, tokenId, gameId } = payload;

  const model = {
    player: toBase58(player),
    amount: toAmount(tokenId, amount),
    tokenId: toDecimal(tokenId),
    index: toDecimal(gameId),
  };

  return model;
};

const changeRTP = (payload) => {
  const { rtp, rtpDivider } = payload;

  const model = {
    rtp: rtp / rtpDivider,
  };

  return model;
};

const changeMinMaxBet = (payload) => {
  const { minBet, maxBet } = payload;

  const model = {
    minBet: toTRX(minBet),
    maxBet: toTRX(maxBet),
  };

  return model;
};

module.exports = {
  game,
  params,
  takeBets,
  finishGame,
  playerWin,
  changeRTP,
  changeMinMaxBet,
};
