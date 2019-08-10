const { toDecimal, toBase58, toTRX } = require('@utils/tron');

const toAmount = (tokenId, amount) =>
  ((toDecimal(tokenId) === 0) ? toTRX(amount) : toDecimal(amount));

const params = (payload) => {
  const { portal, duration, minBet, maxBet } = payload;

  const model = {
    portal: toBase58(portal),
    minBet: toTRX(minBet),
    maxBet: toTRX(maxBet),
    duration: toDecimal(duration),
  };

  return model;
};

const bet = (payload) => {
  const { player, amount, tokenId, sector, finishBlock } = payload;

  const model = {
    player: toBase58(player),
    amount: toAmount(tokenId, amount),
    tokenId,
    sector,
    finishBlock: toDecimal(finishBlock),
  };

  return model;
};

const initGame = (payload) => {
  const { finishBlock, gameId } = payload;

  if (toDecimal(finishBlock) === 0) return null;

  const model = {
    finishBlock: toDecimal(finishBlock),
    index: toDecimal(gameId),
  };

  return model;
};

const takeBet = (payload) => {
  const { player, amount, sector, tokenId, betId, gameId } = payload;

  const model = {
    wallet: toBase58(player),
    bet: toAmount(tokenId, amount),
    tokenId: toDecimal(tokenId),
    sector: toDecimal(sector),
    betId: toDecimal(betId),
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
  const { amount, tokenId, betId, gameId } = payload;

  const model = {
    amount: toAmount(tokenId, amount),
    tokenId: toDecimal(tokenId),
    betId: toDecimal(betId),
    index: toDecimal(gameId),
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

const changeDuration = (payload) => {
  const { gameDuration } = payload;

  const model = {
    gameDuration: toDecimal(gameDuration),
  };

  return model;
};

module.exports = {
  params,
  bet,
  initGame,
  takeBet,
  finishGame,
  playerWin,
  changeMinMaxBet,
  changeDuration,
};
