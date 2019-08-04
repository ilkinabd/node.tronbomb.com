const { toDecimal } = require('@utils/tron');

const takeTRXBet = (payload) => {
  const { index } = payload;

  const model = {
    index: toDecimal(index),
  };

  return model;
};

module.exports = {
  takeTRXBet,
};
