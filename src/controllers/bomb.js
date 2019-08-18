const utils = require('@utils/bomb');
const models = require('@models/bomb');
const { isAddress } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

// Getters

const balanceOf = async(req, res) => {
  const { address } = req.query;

  if (!isAddress(address)) return errorRes(res, 403, 73403);

  const payload = await utils.get.balanceOf(address);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.amount(payload);

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

const rolesParams = async(_req, res) => {
  const requests = [];
  const params = ['owner', 'saleAgent', 'newOwner'];

  for (const param of params) requests.push(utils.get[param]());
  const results = await Promise.all(requests).catch(console.error);
  if (!results) return errorRes(res, 500, 73500);

  const payload = {};
  for (const i in params) payload[params[i]] = results[i];
  const model = models.rolesParams(payload);

  successRes(res, model);
};

const stackingParams = async(_req, res) => {
  const requests = [];
  const params = [
    'minStackingPeriod', 'minStackingAmount', 'stakingHodler'
  ];

  for (const param of params) requests.push(utils.get[param]());
  const results = await Promise.all(requests).catch(console.error);
  if (!results) return errorRes(res, 500, 73500);

  const payload = {};
  for (const i in params) payload[params[i]] = results[i];

  const amount = (await utils.get.balanceOf(results[2])).amount;
  payload.amount = amount;

  const model = models.stackingParams(payload);

  successRes(res, model);
};

// Setters

const setSaleAgent = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address)) return errorRes(res, 403, 73403);

  const result = await utils.set.setSaleAgent(address);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const setStackingHodler = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address)) return errorRes(res, 403, 73403);

  const result = await utils.set.setStackingHodler(address);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const setStackingParams = async(req, res) => {
  const period = req.body.period * 86400;
  const amount = req.body.amount * 10 ** 6;

  const result = await utils.set.setStackingParams(period, amount);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

module.exports = {
  get: {
    balanceOf,
    allowance,
    mainParams,
    rolesParams,
    stackingParams,
  },
  set: {
    setSaleAgent,
    setStackingHodler,
    setStackingParams,
  }
};
