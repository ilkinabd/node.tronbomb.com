const utils = require('@utils/bomb');
const models = require('@models/bomb');
const { isAddress } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

const balanceOf = async(req, res) => {
  const { address } = req.query;

  if (!isAddress(address)) return errorRes(res, 403, 73403);

  const payload = await utils.get.balanceOf(address);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.balance(payload);

  successRes(res, model);
};

module.exports = {
  get: {
    balanceOf,
  },
};
