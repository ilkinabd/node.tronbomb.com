const utils = require('@utils/operations');
const models = require('@models/operations');
const { toSun } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

const filterEvents = (payload, model, from, to) => {
  const events = payload.filter(item => (
    (from || 0) <= item.timestamp && item.timestamp <= (to || Infinity)
  )).map(item => {
    item.data = model(item.result);

    delete item.result;
    delete item.contract;
    delete item.resourceNode;

    return item;
  });

  return events;
};

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

const referralProfit = async(req, res) => {
  const { to, amount } = req.body;

  const result = await utils.func.referralProfit(to, toSun(amount));
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const dividends = async(req, res) => {
  const { to, amount } = req.body;

  const result = await utils.func.dividends(to, toSun(amount));
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const mine = async(req, res) => {
  const result = await utils.func.mine();
  if (result.error) return errorRes(res, 500, 73501, result.error);
  successRes(res);
};

// Events

const withdrawEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.withdraw();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.withdraw, from, to);

  successRes(res, { events });
};

const referralProfitEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.referralProfit();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.withdraw, from, to);

  successRes(res, { events });
};

const dividendsEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.dividends();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.withdraw, from, to);

  successRes(res, { events });
};

module.exports = {
  get: {
    params: getParams,
  },
  func: {
    withdraw,
    referralProfit,
    dividends,
    mine,
  },
  events: {
    withdraw: withdrawEvents,
    referralProfit: referralProfitEvents,
    dividends: dividendsEvents,
  },
};
