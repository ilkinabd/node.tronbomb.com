const { toDecimal, toTRX, toBase58, isNullAddress } = require('@utils/tron');

const address = payload => (isNullAddress(payload) ? null : toBase58(payload));

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

const withdraws = (payload) => {
  const { amount } = payload;

  const model = {
    amount: toTRX(amount),
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
    reward: (toDecimal(tokenId) === 0) ? toTRX(reward) : toDecimal(reward),
    to: toBase58(to),
  };

  return model;
};

module.exports = {
  address,
  takeTRXBet,
  mainStatus,
  withdraws,
  contract,
  reward,
};
