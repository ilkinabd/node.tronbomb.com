const utils = require('@utils/operations');
const models = require('@models/operations');
const { toSun } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

// Getters

const getParams = async(_req, res) => {
  const requests = [];
  const params = ['owner', 'address'];

  for (const param of params) requests.push(utils.get[param]());
  const results = await Promise.all(requests).catch(console.error);
  if (!results) return errorRes(res, 500, 73500);

  const payload = {};
  for (const i in params) payload[params[i]] = results[i];
  const model = models.params(payload);

  successRes(res, model);
};

// Functions

const withdraw = async(req, res) => {
  const { to, amount } = req.body;

  const result = await utils.func.withdraw(toSun(amount), to);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

module.exports = {
  get: {
    params: getParams,
  },
  func: {
    withdraw,
  },
};
