const { toTRX, toDecimal } = require('@utils/tron');

const templates = {
  amount: toTRX,
  name: (value) => (value),
  symbol: (value) => (value),
  decimal: toDecimal,
  totalSupply: (value) => (value / 10 ** 6),
  mintingFinished: (value) => (value),
  totalBurned: (value) => (value / 10 ** 6),
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

module.exports = {
  amount: (payload) => modelBuilder(payload, ['amount']),
  mainParams: (payload) => modelBuilder(payload, [
    'name', 'symbol', 'decimal', 'totalSupply', 'mintingFinished', 'totalBurned'
  ]),
};
