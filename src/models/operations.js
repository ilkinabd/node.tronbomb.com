const { toBase58 } = require('@utils/tron');

const templates = {
  owner: toBase58,
  address: toBase58,
  wallet: toBase58,
  to: toBase58,
  amount: (value) => (value / 10 ** 6),
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

module.exports = {
  params: (payload) => modelBuilder(payload, ['owner', 'address']),
  withdraw: (payload) => modelBuilder(payload, ['wallet', 'to', 'amount']),
  mine: (payload) => modelBuilder(payload, ['wallet']),
};
