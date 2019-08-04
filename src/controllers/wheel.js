const utils = require('@utils/wheel');
const models = require('@models/wheel');
const {
  toBase58, toTRX, toSun, isAddress, isNullAddress, toDecimal
} = require('@utils/tron');
const { resSuccess, resError } = require('@utils/res-builder');

const filterEvents = (events, from, to) => (events.filter((event) => (
  (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
)));

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

  if (!isAddress(address) || isNullAddress(address))
    return res.status(422).json(resError(73402));

  const result = await utils.set.portal(address);
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setBet = async(req, res) => {
  const { min, max } = req.body;

  const result = await utils.set.bet(toSun(min), toSun(max));
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setDuration = async(req, res) => {
  const { duration } = req.body;

  const result = await utils.set.duration(duration);
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
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
  res.json(resSuccess({ result }));
};

// Events

const initGame = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.initGame();
  if (!events) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    event.result.gameId = parseInt(event.result.gameId);
    event.result.finishBlock = parseFloat(event.result.finishBlock);
  }

  res.json(resSuccess({ events }));
};

const takeBet = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.takeBet();
  if (!events) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    event.result.gameId = parseInt(event.result.gameId);
    event.result.amount = toTRX(event.result.amount);
    event.result.tokenId = parseInt(event.result.tokenId);
    event.result.betId = parseInt(event.result.betId);
    event.result.sector = parseInt(event.result.sector);
    event.result.player = toBase58(event.result.player);
  }

  res.json(resSuccess({ events }));
};

const finishGame = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.finishGame();
  if (!events) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    event.result.result = parseInt(event.result.result);
    event.result.gameId = parseInt(event.result.gameId);
  }

  res.json(resSuccess({ events }));
};

const playerWin = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.playerWin();
  if (!events) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    event.result.reward = toTRX(event.result.reward);
    event.result.betId = parseInt(event.result.betId);
    event.result.gameId = parseInt(event.result.gameId);
  }

  res.json(resSuccess({ events }));
};

const changeParams = async(req, res) => {
  const { from, to } = req.query;

  const bet = await utils.events.changeMinMaxBet();
  if (!bet) return res.status(500).json(resError(73500));
  const duration = await utils.events.changeDuration();
  if (!duration) return res.status(500).json(resError(73500));

  for (const event of bet) {
    event.result.minBet = toTRX(event.result.minBet);
    event.result.maxBet = toTRX(event.result.maxBet);
  }
  for (const event of duration) {
    event.result.gameDuration = parseInt(event.result.gameDuration);
  }

  const events = filterEvents(bet.concat(duration), from, to);
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
