const { toDecimal, toTRX, toBase58 } = require('@utils/tron');

const templates = {
  address: toBase58,
  owner: toBase58,
  BOMBHodler: toBase58,
  to: toBase58,
  minTRXBet: (value) => (value / 10 ** 6),
  maxTRXBet: (value) => (value / 10 ** 6),
  minBOMBBet: (value) => (value / 10 ** 6),
  maxBOMBBet: (value) => (value / 10 ** 6),
  balanceBOMB: (value) => (value / 10 ** 6),
  prize: (value) => (value / 10 ** 6),
  index: toDecimal,
  tokenId: toDecimal,
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

module.exports = {
  gameContract: (payload) => modelBuilder(payload, [
    'address', 'index', 'status'
  ]),
  params: (payload) => modelBuilder(payload, [
    'owner', 'mainStatus', 'balanceTRX', 'BOMBHodler', 'balanceBOMB',
    'minTRXBet', 'maxTRXBet', 'minBOMBBet', 'maxBOMBBet', 'address'
  ]),
  takeBet: (payload) => modelBuilder(payload, ['index']),
  payReward: (payload) => modelBuilder(payload, [
    'to', 'prize', 'tokenId'
  ]),
  mainStatus,
  withdraw,
  contract,
};
