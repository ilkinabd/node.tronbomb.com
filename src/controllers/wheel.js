const utils = require('@utils/wheel');
const {
  toBase58, toTRX, toSun, isAddress, isNullAddress, toDecimal
} = require('@utils/tron');
const { resSuccess, resError } = require('@utils/res-builder');

const toGameModel = (game) => {
  game.gameId = toDecimal(game.gameId);
  game.finishBlock = toDecimal(game.finishBlock);
  game.betsCount = toDecimal(game.betsCount);
  game.result = (game.status !== 2) ? null : game.result;

  switch (game.status) {
    case 0: game.status = 'empty'; break;
    case 1: game.status = 'start'; break;
    case 2: game.status = 'finish'; break;
  }
};

const filterEvents = (events, from, to) => (events.filter((event) => (
  (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
)));

// Getters

const getGame = async(req, res) => {
  const { gameId } = req.query;

  const game = await utils.get.game(gameId);
  if (game === undefined) return res.status(500).json(resError(73500));
  toGameModel(game);

  res.json(resSuccess({ game }));
};

const getGames = async(_req, res) => {
  const totalGames = toDecimal(await utils.get.totalGames());

  const requests = [];
  for (let gameId = 0; gameId < totalGames; gameId++) {
    requests.push(utils.get.game(gameId.toString()));
  }

  const games = await Promise.all(requests).catch((error) => {
    console.error(error);
    return res.status(500).json(resError(73500));
  });
  for (const game of games) toGameModel(game);

  res.json(resSuccess({ games }));
};

const getParams = async(_req, res) => {
  const portal = toBase58(await utils.get.portal());
  const minBet = toTRX(await utils.get.minBet());
  const maxBet = toTRX(await utils.get.maxBet());
  const duration = parseInt(await utils.get.duration());

  res.json(resSuccess({ portal, minBet, maxBet, duration }));
};

const getGameBets = async(req, res) => {
  const { gameId } = req.query;

  const betsCount = (await utils.get.game(gameId)).betsCount;

  const requests = [];
  for (let betId = 0; betId < betsCount; betId++) {
    requests.push(utils.get.gameBet(betId, gameId));
  }
  const bets = await Promise.all(requests).catch((error) => {
    console.error(error);
    return res.status(500).json(resError(73500));
  });

  for (const bet of bets) {
    bet.player = toBase58(bet.player);
    bet.amount = toTRX(bet.amount);
  }

  res.json(resSuccess({ bets }));
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
    changeParams,
  },
};
