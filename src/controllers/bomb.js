const utils = require('@utils/bomb');
const models = require('@models/bomb');
const { isAddress } = require('@utils/tron');
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

const balanceOf = async(req, res) => {
  const { address } = req.query;

  if (!isAddress(address)) return errorRes(res, 403, 73402);

  const payload = await utils.get.balanceOf(address);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.amount(payload);

  successRes(res, model);
};

const allowance = async(req, res) => {
  const { address, spender } = req.query;

  if (!isAddress(address)) return errorRes(res, 403, 73402);
  if (!isAddress(spender)) return errorRes(res, 403, 73402);

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

  if (!isAddress(address)) return errorRes(res, 403, 73402);

  const result = await utils.set.setSaleAgent(address);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const setStackingHodler = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address)) return errorRes(res, 403, 73402);

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

const transferOwnership = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address)) return errorRes(res, 403, 73402);

  const result = await utils.set.transferOwnership(address);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const acceptOwnership = async(_req, res) => {
  const result = await utils.set.acceptOwnership();
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

// Functions

const transfer = async(req, res) => {
  const { to } = req.body;
  const amount = req.body.amount * 10 ** 6;

  const result = await utils.func.transfer(to, amount);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const transferFrom = async(req, res) => {
  const { from, to } = req.body;
  const amount = req.body.amount * 10 ** 6;

  const result = await utils.func.transferFrom(from, to, amount);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const approve = async(req, res) => {
  const { spender } = req.body;
  const amount = req.body.amount * 10 ** 6;

  const result = await utils.func.approve(spender, amount);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const increaseApproval = async(req, res) => {
  const { spender } = req.body;
  const amount = req.body.amount * 10 ** 6;

  const result = await utils.func.increaseApproval(spender, amount);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const decreaseApproval = async(req, res) => {
  const { spender } = req.body;
  const amount = req.body.amount * 10 ** 6;

  const result = await utils.func.decreaseApproval(spender, amount);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const freeze = async(req, res) => {
  const { period } = req.body;
  const amount = req.body.amount * 10 ** 6;

  const result = await utils.func.freeze(amount, period);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const freezeAgain = async(req, res) => {
  const { period } = req.body;
  const amount = req.body.amount * 10 ** 6;

  const result = await utils.func.freezeAgain(amount, period);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const mint = async(req, res) => {
  const { to } = req.body;
  const amount = req.body.amount * 10 ** 6;

  const result = await utils.func.mint(to, amount);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const finishMinting = async(_req, res) => {
  const result = await utils.func.finishMinting();
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

// Events

const transferEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.transfer();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.transferEvent, from, to);

  successRes(res, { events });
};

const burnEvent = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.burn();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.burnEvent, from, to);

  successRes(res, { events });
};

const approvalEvent = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.approval();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.approvalEvent, from, to);

  successRes(res, { events });
};

const freezeEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.freeze();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.freezeEvent, from, to);

  successRes(res, { events });
};

const freezeAgainEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.freezeAgain();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.freezeEvent, from, to);

  successRes(res, { events });
};

const mintEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.mint();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.mintEvent, from, to);

  successRes(res, { events });
};

const newSaleAgentEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.newSaleAgent();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.newSaleAgentEvents, from, to);

  successRes(res, { events });
};

const ownershipEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.ownershipTransferred();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.ownershipEvents, from, to);

  successRes(res, { events });
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
    transferOwnership,
    acceptOwnership,
  },
  func: {
    transfer,
    transferFrom,
    approve,
    increaseApproval,
    decreaseApproval,
    freeze,
    freezeAgain,
    mint,
    finishMinting,
  },
  events: {
    transfer: transferEvents,
    burn: burnEvent,
    approval: approvalEvent,
    freeze: freezeEvents,
    freezeAgain: freezeAgainEvents,
    mint: mintEvents,
    newSaleAgent: newSaleAgentEvents,
    ownershipTransferred: ownershipEvents,
  },
};
