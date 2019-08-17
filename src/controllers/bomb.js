const utils = require('@utils/bomb');
const models = require('@models/bomb');
const { isAddress } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

const balanceOf = async(req, res) => {
  const { address } = req.query;

  if (!isAddress(address)) return errorRes(res, 403, 73403);

  const payload = await utils.get.balanceOf(address);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.amount(payload);

  successRes(res, model);
};

const mainParams = async(_req, res) => {
  const requests = [];
  const params = [
    'name', 'symbol', 'decimal', 'totalSupply', 'mintingFinished', 'totalBurned'
  ];

  for (const param of params) requests.push(utils.get[param]());
  const results = await Promise.all(requests).catch(console.error);
  if (!results) return errorRes(res, 500, 73500);

  const payload = {};
  for (const i in params) payload[params[i]] = results[i];
  const model = models.mainParams(payload);

  successRes(res, model);
};

const allowance = async(req, res) => {
  const { address, spender } = req.query;

  if (!isAddress(address)) return errorRes(res, 403, 73403);
  if (!isAddress(spender)) return errorRes(res, 403, 73403);

  const payload = await utils.get.allowance(address, spender);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.amount(payload);

  successRes(res, model);
};

module.exports = {
  get: {
    balanceOf,
    mainParams,
    allowance,
  },
};
