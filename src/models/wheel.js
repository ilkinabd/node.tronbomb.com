const { toDecimal, toBase58, toTRX } = require('@utils/tron');

const toAmount = (tokenId, amount) =>
  ((toDecimal(tokenId) === 0) ? toTRX(amount) : toDecimal(amount));

const params = (payload) => {
  const { portal, duration, minBet, maxBet, startBlock, processBets } = payload;

  const model = {
    portal: toBase58(portal),
    minBet: toTRX(minBet),
    maxBet: toTRX(maxBet),
    duration: toDecimal(duration),
    startBlock: toDecimal(startBlock),
    processBets: toDecimal(processBets),
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

const takeBet = (payload) => {
  const { player, amount, tokenId, sector, finishBlock, betId } = payload;

  const model = {
    wallet: toBase58(player),
    bet: toAmount(tokenId, amount),
    tokenId: toDecimal(tokenId),
    sector: toDecimal(sector),
    finishBlock: toDecimal(finishBlock),
    index: toDecimal(betId),
  };

  return model;
};

const playerWin = (payload) => {
  const { amount, tokenId, betId } = payload;

  const model = {
    amount: toAmount(tokenId, amount),
    tokenId: toDecimal(tokenId),
    index: toDecimal(betId),
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
  takeBet,
  playerWin,
  changeMinMaxBet,
  changeDuration,
};
