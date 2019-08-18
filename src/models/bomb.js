const { toDecimal, isNullAddress, toBase58 } = require('@utils/tron');

const templates = {
  amount: (value) => (value / 10 ** 6),
  name: (value) => (value),
  symbol: (value) => (value),
  decimal: toDecimal,
  totalSupply: (value) => (value / 10 ** 6),
  mintingFinished: (value) => (value),
  totalBurned: (value) => (value / 10 ** 6),
  owner: toBase58,
  saleAgent: (value) => ((isNullAddress) ? null : toBase58(value)),
  newOwner: (value) => ((isNullAddress) ? null : toBase58(value)),
  minStackingPeriod: (value) => toDecimal(value) / 3600,
  minStackingAmount: (value) => (value / 10 ** 6),
  stakingHodler: toBase58,
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
  rolesParams: (payload) => modelBuilder(payload, [
    'owner', 'saleAgent', 'newOwner'
  ]),
  stackingParams: (payload) => modelBuilder(payload, [
    'minStackingPeriod', 'minStackingAmount', 'stakingHodler', 'amount'
  ]),
};
