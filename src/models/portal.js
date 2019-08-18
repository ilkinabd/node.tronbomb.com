const { toDecimal, toTRX, toBase58, isNullAddress } = require('@utils/tron');

const templates = {
  address: toBase58,
  index: (value) => (value),
  status: (value) => (value),
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

const address = payload => (isNullAddress(payload) ? null : toBase58(payload));

const toAmount = (tokenId, amount) =>
  ((toDecimal(tokenId) === 0) ? toTRX(amount) : toDecimal(amount));

const takeTRXBet = (payload) => {
  const { index } = payload;

  const model = {
    index: toDecimal(index),
  };

  return model;
};

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
  contractParams: (payload) => modelBuilder(payload, [
    'address', 'index', 'status'
  ]),
  address,
  takeTRXBet,
  mainStatus,
  withdraw,
  contract,
  reward,
};
