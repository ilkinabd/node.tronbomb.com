const utils = require('@utils/portal');
const { toBase58, toTRX, toSun } = require('@utils/tron');
const { success: resSuccess, error: resError } = require('@utils/res-builder');

const filterEvents = (events, from, to) => (events.filter((event) => (
  (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
)));

const balance = async(_req, res) => {
  let balance = await utils.balance();
  if (balance === undefined) return res.status(500).json(resError(73500));

  balance = toTRX(balance);
  res.json(resSuccess({ balance }));
};

const withdraw = async(req, res) => {
  const { amount, tokenId } = req.body;

  const result = await utils.withdraw(toSun(amount), tokenId);
  if (result === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

// Getters

const getMainStatus = async(_req, res) => {
  const mainStatus = await utils.get.mainStatus();
  if (mainStatus === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ mainStatus }));
};

const getOwner = async(_req, res) => {
  let owner = await utils.get.owner();
  if (owner === undefined) return res.status(500).json(resError(73500));

  owner = toBase58(owner);
  res.json(resSuccess({ owner }));
};

const getToken = async(req, res) => {
  const { tokenId } = req.query;

  let token = await utils.get.token(tokenId);
  if (token === undefined) return res.status(500).json(resError(73500));

  token = toBase58(token);
  res.json(resSuccess({ token }));
};

const getGame = async(req, res) => {
  const { gameId } = req.query;

  let game = await utils.get.game(gameId);
  if (game === undefined) return res.status(500).json(resError(73500));

  game = toBase58(game);
  res.json(resSuccess({ game }));
};

const getGameStatus = async(req, res) => {
  const { address } = req.query;

  const gameStatus = await utils.get.gameStatus(address);
  if (gameStatus === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ gameStatus }));
};

// Setters

const setMainStatus = async(req, res) => {
  const { status } = req.body;

  const result = await utils.set.mainStatus(status);
  if (result === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setToken = async(req, res) => {
  const { tokenId, address } = req.body;

  const result = await utils.set.token(tokenId, address);
  if (result === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setGame = async(req, res) => {
  const { gameId, address } = req.body;

  const result = await utils.set.game(gameId, address);
  if (result === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setGameStatus = async(req, res) => {
  const { address, status } = req.body;

  const result = await utils.set.gameStatus(address, status);
  if (result === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

// Payable

const takeTRXBet = async(req, res) => {
  const { amount, gameId, data } = req.body;

  const result = await utils.payable.takeTRXBet(toSun(amount), gameId, data);
  if (result === null || result === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ result }));
};

// Events

const mainStatus = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.mainStatus();
  if (events === undefined) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  res.json(resSuccess({ events }));
};

const withdraws = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.withdraws();
  if (events === undefined) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    event.result.amount = toTRX(event.result.amount);
  }

  res.json(resSuccess({ events }));
};

const tokens = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.tokens();
  if (events === undefined) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    event.result.contractAddress = toBase58(event.result.contractAddress);
  }

  res.json(resSuccess({ events }));
};

const games = async(req, res) => {
  const { from, to } = req.query;

  const games = await utils.events.games();
  if (games === undefined) return res.status(500).json(resError(73500));
  const gamesStatuses = await utils.events.gamesStatuses();
  if (gamesStatuses === undefined) return res.status(500).json(resError(73500));

  const events = filterEvents(games.concat(gamesStatuses), from, to);
  for (const event of events) {
    event.result.contractAddress = toBase58(event.result.contractAddress);
  }

  res.json(resSuccess({ events }));
};

const rewards = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.rewards();
  if (events === undefined) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    const { reward, tokenId, to } = event.result;
    if (tokenId === '0') event.result.reward = toTRX(reward);
    event.result.to = toBase58(to);
  }

  res.json(resSuccess({ events }));
};

module.exports = {
  balance,
  withdraw,
  get: {
    mainStatus: getMainStatus,
    owner: getOwner,
    token: getToken,
    game: getGame,
    gameStatus: getGameStatus,
  },
  set: {
    mainStatus: setMainStatus,
    token: setToken,
    game: setGame,
    gameStatus: setGameStatus,
  },
  payable: {
    takeTRXBet,
  },
  events: {
    mainStatus,
    withdraws,
    tokens,
    games,
    rewards,
  },
};
