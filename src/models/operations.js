const { toBase58 } = require('@utils/tron');

const templates = {
  owner: toBase58,
  address: toBase58,
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

module.exports = {
  params: (payload) => modelBuilder(payload, ['owner', 'address']),
};
