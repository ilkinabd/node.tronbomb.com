const { toBase58 } = require('@utils/tron');

const templates = {
  wallet: toBase58,
  amount: value => value / 10 ** 6,
};

// address wallet, uint amount, bool isToken
const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

module.exports = {
  charge: payload => modelBuilder(payload, ['wallet', 'amount']),
  withdraw: payload => modelBuilder(payload, ['wallet', 'amount']),
};
