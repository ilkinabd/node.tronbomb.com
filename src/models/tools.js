const { toDecimal, toBase58 } = require('@utils/tron');

const operation = (payload) => {
  const { wallet, code } = payload;

  const model = {
    wallet: toBase58(wallet),
    code: toDecimal(code),
  };

  return model;
};

module.exports = {
  operation,
};
