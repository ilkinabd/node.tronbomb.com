const utils = require('@utils/withdraw');
const { resSuccess, resError } = require('@utils/res-builder');

// Functions

const withdraw = async(req, res) => {
  const { code } = req.body;

  const result = await utils.func.withdraw(code);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

module.exports = {
  func: {
    withdraw,
  },
};
