const { toDecimal, toBase58, toTRX } = require('@utils/tron');

const templates = {
  index: toDecimal,
  tokenId: toDecimal,
  sector: toDecimal,
  finishBlock: toDecimal,
  wallet: toBase58,
  bet: (value) => (value / 10 ** 6),
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

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
  bet: (payload) => modelBuilder(payload, [
    'wallet', 'bet', 'tokenId', 'finishBlock', 'sector', 'index'
  ]),
  params,
  takeBet,
  playerWin,
  changeMinMaxBet,
  changeDuration,
};
