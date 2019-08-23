const { toBase58, toDecimal, toTRX } = require('@utils/tron');

const templates = {
  index: toDecimal,
  finishBlock: toDecimal,
  tokenId: toDecimal,
  totalGames: toDecimal,
  wallet: toBase58,
  portal: toBase58,
  owner: toBase58,
  address: toBase58,
  bet: (value) => (value / 10 ** 6),
  rtp: (value) => (value / 10 ** 3),
  state: (value) => [null, 'start', 'finish'][value],
  number: (value) => (value),
  roll: (value) => (value),
  result: (value) => (value),
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

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
  game: (payload) => modelBuilder(payload, [
    'index', 'finishBlock', 'wallet', 'bet',
    'tokenId', 'number', 'roll', 'result', 'state'
  ]),
  params: (payload) => modelBuilder(payload, [
    'portal', 'owner', 'totalGames', 'rtp', 'address'
  ]),
  rng: (payload) => modelBuilder(payload, ['result']),
  takeBets,
  finishGame,
  playerWin,
  changeRTP,
  changeMinMaxBet,
};
