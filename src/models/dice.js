const { toBase58, toDecimal, toTRX } = require('@utils/tron');

const templates = {
  index: toDecimal,
  finishBlock: toDecimal,
  tokenId: toDecimal,
  totalGames: toDecimal,
  number: toDecimal,
  result: toDecimal,
  wallet: toBase58,
  portal: toBase58,
  owner: toBase58,
  address: toBase58,
  bet: (value) => (value / 10 ** 6),
  rtp: (value) => (value / 10 ** 3),
  state: (value) => [null, 'start', 'finish'][value],
  roll: (value) => ['under', 'over', 'exact'][value],
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

const toAmount = (tokenId, amount) =>
  ((toDecimal(tokenId) === 0) ? toTRX(amount) : toDecimal(amount));

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
  game: (payload) => modelBuilder(payload, [
    'index', 'finishBlock', 'wallet', 'bet',
    'tokenId', 'number', 'roll', 'result', 'state'
  ]),
  params: (payload) => modelBuilder(payload, [
    'portal', 'owner', 'totalGames', 'rtp', 'address'
  ]),
  rng: (payload) => modelBuilder(payload, ['result']),
  payReward: (payload) => modelBuilder(payload, [
    'wallet', 'bet', 'number', 'roll', 'tokenId', 'finishBlock', 'index'
  ]),
  finishGame: (payload) => modelBuilder(payload, ['result', 'index']),
  playerWin,
  changeRTP,
  changeMinMaxBet,
};
