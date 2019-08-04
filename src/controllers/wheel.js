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

const getGame = async(req, res) => {
  const { gameId } = req.query;

  const payload = await utils.get.game(gameId);
  if (!payload) return res.status(500).json(resError(73500));
  const game = models.game(payload);

  res.json(resSuccess({ game }));
};

const getGames = async(req, res) => {
  const { from, to } = req.query;

  const totalGames = toDecimal(await utils.get.totalGames());
  if (!totalGames) return res.status(500).json(resError(73500));

  const first = from || 0;
  const last = Math.min(totalGames, to || totalGames);

  const requests = [];
  for (let id = first; id < last; id++) requests.push(utils.get.game(id));
  const payload = await Promise.all(requests).catch(console.error);

  const games = Array.from(payload, item => models.game(item));

  res.json(resSuccess({ games }));
};

const getGameBets = async(req, res) => {
  const { gameId } = req.query;

  const betsCount = (await utils.get.game(gameId)).betsCount;
  if (!betsCount) return res.status(500).json(resError(73500));

  const requests = [];
  for (let id = 0; id < betsCount; id++) {
    requests.push(utils.get.gameBet(id, gameId));
  }
  const payload = await Promise.all(requests).catch(console.error);

  const bets = Array.from(payload, item => models.bet(item));

  res.json(resSuccess({ bets }));
};

const getParams = async(_req, res) => {
  const portal = await utils.get.portal();
  const rtp = await utils.get.rtp();
  const rtpDivider = await utils.get.rtpDivider();
  const minBet = await utils.get.minBet();
  const maxBet = await utils.get.maxBet();

  const params = models.params({ portal, rtp, rtpDivider, minBet, maxBet });

  res.json(resSuccess({ params }));
};

const getRNG = async(req, res) => {
  const { blockNumber, blockHash } = req.query;

  const payload = await utils.get.rng(blockNumber, blockHash);
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

const init = async(_req, res) => {
  const result = await utils.func.init();
  if (!result) return res.status(500).json(resError(73500));

  result.gameId = toDecimal(result.gameId);

  res.json(resSuccess({ result }));
};

const finish = async(req, res) => {
  const { gameId } = req.body;

  const result = await utils.func.finish(gameId);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

// Events

const initGame = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.initGame();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.initGame, from, to);

  res.json(resSuccess({ events }));
};

const takeBet = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.takeBet();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.takeBet, from, to);

  res.json(resSuccess({ events }));
};

const finishGame = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.finishGame();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.finishGame, from, to);

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
    game: getGame,
    games: getGames,
    gameBets: getGameBets,
    params: getParams,
    rng: getRNG,
  },
  set: {
    portal: setPortal,
    bet: setBet,
    duration: setDuration
  },
  func: {
    init,
    finish,
  },
  events: {
    initGame,
    takeBet,
    finishGame,
    playerWin,
    changeParams,
  },
};
