const utils = require('@utils/wheel');
const models = require('@models/wheel');
const { isAddress, toDecimal } = require('@utils/tron');
const {
  resSuccess, resError, successRes, errorRes
} = require('@utils/res-builder');

const filterEvents = (payload, model, from, to) => {
  const events = payload.filter(item => (
    (from || 0) <= item.timestamp && item.timestamp <= (to || Infinity)
  )).map(item => {
    item.result = model(item.result);
    return item;
  });

  return events;
};

// Getters

const getBet = async(req, res) => {
  const { index } = req.query;

  const totalBets = toDecimal(await utils.get.totalBets());
  if (!totalBets) return errorRes(res, 500, 73500);

  if (index >= totalBets) return errorRes(res, 422, 73406);

  const payload = await utils.get.bet(index);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.bet(payload);

  successRes(res, model);
};

const getBets = async(req, res) => {
  const { from, to } = req.query;

  const totalBets = toDecimal(await utils.get.totalBets());
  if (!totalBets) return errorRes(res, 500, 73500);

  const first = from || 0;
  const last = Math.min(totalBets, to || totalBets);

  const requests = [];
  for (let id = first; id < last; id++) requests.push(utils.get.bet(id));
  const payload = await Promise.all(requests).catch(console.error);

  const games = Array.from(payload, item => models.bet(item));

  successRes(res, { games });
};

const getParams = async(_req, res) => {
  const requests = [];
  const params = [
    'portal', 'totalBets', 'processedBets', 'duration',
    'startBlock', 'owner', 'address'
  ];

  for (const param of params) requests.push(utils.get[param]());
  const results = await Promise.all(requests).catch(console.error);
  if (!results) return errorRes(res, 500, 73500);

  const payload = {};
  for (const i in params) payload[params[i]] = results[i];
  const model = models.params(payload);

  successRes(res, model);
};

// Setters

const setDuration = async(req, res) => {
  const { value } = req.body;

  const result = await utils.set.duration(value);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const setPortal = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address)) return errorRes(res, 422, 73402);

  const result = await utils.set.portal(address);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

// Functions

const rng = async(req, res) => {
  const { block, hash } = req.query;

  const payload = await utils.func.rng(block, hash);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.rng(payload);

  successRes(res, model);
};

const finish = async(_req, res) => {
  const result = await utils.func.finish();
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

// Events

const takeBet = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.takeBet();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.takeBet, from, to);

  res.json(resSuccess({ events }));
};

const playerWin = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.playerWin();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.playerWin, from, to);

  res.json(resSuccess({ events }));
};

const changeParams = async(req, res) => {
  const { from, to } = req.query;

  const betPayload = await utils.events.changeMinMaxBet();
  if (!betPayload) return res.status(500).json(resError(73500));
  const bet = filterEvents(betPayload, models.changeMinMaxBet, from, to);

  const durPayload = await utils.events.changeDuration();
  if (!durPayload) return res.status(500).json(resError(73500));
  const duration = filterEvents(durPayload, models.changeDuration, from, to);

  const events = bet.concat(duration);
  res.json(resSuccess({ events }));
};

module.exports = {
  get: {
    bet: getBet,
    bets: getBets,
    params: getParams,
  },
  set: {
    duration: setDuration,
    portal: setPortal,
  },
  func: {
    rng,
    finish,
  },
  events: {
    takeBet,
    playerWin,
    changeParams,
  },
};
