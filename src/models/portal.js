const { toDecimal, toTRX, toBase58 } = require('@utils/tron');

const templates = {
  address: toBase58,
  owner: toBase58,
  minBet: (value) => (value / 10 ** 6),
  maxBet: (value) => (value / 10 ** 6),
  balanceBOMB: (value) => (value / 10 ** 6),
  index: toDecimal,
  status: (value) => (value),
  mainStatus: (value) => (value),
  balanceTRX: (value) => (value),
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

const toAmount = (tokenId, amount) =>
  ((toDecimal(tokenId) === 0) ? toTRX(amount) : toDecimal(amount));

const mainStatus = (payload) => {
  const { mainStatus } = payload;

  const model = {
    mainStatus: mainStatus === 'true',
  };

  return model;
};

const withdraw = (payload) => {
  const { amount, tokenId } = payload;

  const model = {
    amount: toAmount(tokenId, amount),
    tokenId: toDecimal(tokenId),
  };

  return model;
};

const contract = (payload) => {
  const { contractAddress } = payload;

  const model = {
    contractAddress: toBase58(contractAddress),
  };

  return model;
};

const reward = (payload) => {
  const { reward, tokenId, to } = payload;

  const model = {
    reward: toAmount(tokenId, reward),
    to: toBase58(to),
  };

  return model;
};

module.exports = {
  gameContract: (payload) => modelBuilder(payload, [
    'address', 'index', 'status'
  ]),
  tokenContract: (payload) => modelBuilder(payload, [
    'address', 'minBet', 'maxBet', 'index'
  ]),
  params: (payload) => modelBuilder(payload, [
    'owner', 'mainStatus', 'balanceTRX', 'balanceBOMB', 'address'
  ]),
  takeBet: (payload) => modelBuilder(payload, ['index']),
  mainStatus,
  withdraw,
  contract,
  reward,
};
