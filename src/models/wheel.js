const { toDecimal, toBase58, toTRX } = require('@utils/tron');

const templates = {
  index: toDecimal,
  tokenId: toDecimal,
  sector: toDecimal,
  totalBets: toDecimal,
  processedBets: toDecimal,
  duration: toDecimal,
  startBlock: toDecimal,
  finishBlock: toDecimal,
  wallet: toBase58,
  portal: toBase58,
  owner: toBase58,
  address: toBase58,
  bet: (value) => (value / 10 ** 6),
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

const toAmount = (tokenId, amount) =>
  ((toDecimal(tokenId) === 0) ? toTRX(amount) : toDecimal(amount));

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
  params: (payload) => modelBuilder(payload, [
    'portal', 'totalBets', 'processedBets', 'duration',
    'startBlock', 'owner', 'address'
  ]),
  takeBet,
  playerWin,
  changeMinMaxBet,
  changeDuration,
};
