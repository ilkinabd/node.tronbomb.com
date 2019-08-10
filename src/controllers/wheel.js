const utils = require('@utils/wheel');
const models = require('@models/wheel');
const { toSun, isAddress, toDecimal } = require('@utils/tron');
const { resSuccess, resError } = require('@utils/res-builder');

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
  const { id } = req.query;

  const payload = await utils.get.bet(id);
  if (!payload) return res.status(500).json(resError(73500));
  const bet = models.bet(payload);

  res.json(resSuccess({ bet }));
};

const getBets = async(req, res) => {
  const { from, to } = req.query;

  const totalBets = toDecimal(await utils.get.totalBets());
  if (!totalBets) return res.status(500).json(resError(73500));

  const first = from || 0;
  const last = Math.min(totalBets, to || totalBets);

  const requests = [];
  for (let id = first; id < last; id++) requests.push(utils.get.bet(id));
  const payload = await Promise.all(requests).catch(console.error);

  const games = Array.from(payload, item => models.bet(item));

  res.json(resSuccess({ games }));
};

const getParams = async(_req, res) => {
  const portal = await utils.get.portal();
  const minBet = await utils.get.minBet();
  const maxBet = await utils.get.maxBet();
  const duration = await utils.get.duration();
  const startBlock = await utils.get.startBlock();
  const processBets = await utils.get.processBets();

  const params = models.params({
    portal, duration, minBet, maxBet, startBlock, processBets
  });

  res.json(resSuccess({ params }));
};

const getRNG = async(req, res) => {
  const { block, hash } = req.query;

  const payload = await utils.get.rng(block, hash);
  if (!payload) return res.status(500).json(resError(73500));

  const random = payload.result;

  res.json(resSuccess({ random }));
};

// Setters

const setPortal = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address)) return res.status(422).json(resError(73402));
  const result = await utils.set.portal(address);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

const setBet = async(req, res) => {
  const { min, max } = req.body;

  const result = await utils.set.bet(toSun(min), toSun(max));
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

const setDuration = async(req, res) => {
  const { duration } = req.body;

  const result = await utils.set.duration(duration);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

// Functions

const finish = async(_req, res) => {
  const result = await utils.func.finish();
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
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
    rng: getRNG,
  },
  set: {
    portal: setPortal,
    bet: setBet,
    duration: setDuration
  },
  func: {
    finish,
  },
  events: {
    takeBet,
    playerWin,
    changeParams,
  },
};
