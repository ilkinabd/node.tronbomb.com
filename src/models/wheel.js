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
  result: toDecimal,
  wallet: toBase58,
  portal: toBase58,
  owner: toBase58,
  address: toBase58,
  bet: (value) => (value / 10 ** 6),
  prize: (value) => (value / 10 ** 6),
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

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
  rng: (payload) => modelBuilder(payload, ['result']),
  takeBet: (payload) => modelBuilder(payload, [
    'wallet', 'bet', 'tokenId', 'finishBlock', 'sector', 'index'
  ]),
  playerWin: (payload) => modelBuilder(payload, [
    'wallet', 'prize', 'tokenId', 'index'
  ]),
  changeMinMaxBet,
  changeDuration,
};
