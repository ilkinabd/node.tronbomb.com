const utils = require('@utils/dice');
const models = require('@models/dice');
const { toDecimal, toSun, isAddress } = require('@utils/tron');
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

const getGame = async(req, res) => {
  const { index } = req.query;

  const totalGames = toDecimal(await utils.get.totalGames());
  if (!totalGames) return errorRes(res, 500, 73500);

  if (index >= totalGames) return errorRes(res, 422, 73405);

  const payload = await utils.get.game(index);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.game(payload);

  successRes(res, model);
};

const getGames = async(req, res) => {
  const { from, to } = req.query;

  const totalGames = toDecimal(await utils.get.totalGames());
  if (!totalGames) return errorRes(res, 500, 73500);

  const first = from || 0;
  const last = Math.min(totalGames, to || totalGames);

  const requests = [];
  for (let id = first; id < last; id++) requests.push(utils.get.game(id));
  const payload = await Promise.all(requests).catch(console.error);

  const games = Array.from(payload, item => models.game(item));

  successRes(res, { games });
};

const getParams = async(_req, res) => {
  const requests = [];
  const params = ['portal', 'totalGames', 'rtp', 'owner', 'address'];

  for (const param of params) requests.push(utils.get[param]());
  const results = await Promise.all(requests).catch(console.error);
  if (!results) return errorRes(res, 500, 73500);

  const payload = {};
  for (const i in params) payload[params[i]] = results[i];
  const model = models.params(payload);

  successRes(res, model);
};

// Setters

const setPortal = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address)) return errorRes(res, 422, 73402);

  const result = await utils.set.portal(address);
  if (!result) return errorRes(res, 500, 73500);

  successRes(res);
};

const setRTP = async(req, res) => {
  const { rtp } = req.body;

  const divider = 10000;
  const result = await utils.set.rtp(Math.floor(rtp * divider), divider);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

const setBet = async(req, res) => {
  const { min, max } = req.body;

  const result = await utils.set.bet(toSun(min), toSun(max));
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

// Functions

const rng = async(req, res) => {
  const { address, block, hash } = req.query;

  const payload = await utils.func.rng(address, block, hash);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.rng(payload);

  successRes(res, model);
};

const finishGame = async(req, res) => {
  const { id } = req.body;

  const result = await utils.func.finishGame(id);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

// Events

const takeBetEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.takeBet();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.takeBets, from, to);

  res.json(resSuccess({ events }));
};

const finishGameEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.finishGame();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.finishGame, from, to);

  res.json(resSuccess({ events }));
};

const playersWinEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.playersWin();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.playerWin, from, to);

  res.json(resSuccess({ events }));
};

const changeParamsEvents = async(req, res) => {
  const { from, to } = req.query;

  const rtpPayload = await utils.events.changeRTP();
  if (!rtpPayload) return res.status(500).json(resError(73500));
  const rtp = filterEvents(rtpPayload, models.changeRTP, from, to);

  const betPayload = await utils.events.changeMinMaxBet();
  if (!betPayload) return res.status(500).json(resError(73500));
  const bet = filterEvents(betPayload, models.changeMinMaxBet, from, to);

  const events = rtp.concat(bet);
  res.json(resSuccess({ events }));
};

module.exports = {
  get: {
    game: getGame,
    games: getGames,
    params: getParams,
  },
  set: {
    portal: setPortal,
    rtp: setRTP,
    bet: setBet,
  },
  func: {
    rng,
    finishGame,
  },
  events: {
    takeBet: takeBetEvents,
    finishGame: finishGameEvents,
    playersWin: playersWinEvents,
    changeParams: changeParamsEvents,
  },
};
