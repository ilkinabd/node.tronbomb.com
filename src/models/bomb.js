const { toTRX } = require('@utils/tron');

const templates = {
  amount: toTRX
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

module.exports = {
  balance: (payload) => modelBuilder(payload, ['amount']),
};
