const utils = require('@utils/portal');
const {
  toBase58, toTRX, toSun, isAddress, isNullAddress
} = require('@utils/tron');
const { resSuccess, resError } = require('@utils/res-builder');

const filterEvents = (events, from, to) => (events.filter((event) => (
  (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
)));

// Getters

const balance = async(_req, res) => {
  const balance = await utils.balance();
  if (balance === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ balance }));
};

const getMainStatus = async(_req, res) => {
  const mainStatus = await utils.get.mainStatus();
  if (mainStatus === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ mainStatus }));
};

const getOwner = async(_req, res) => {
  const owner = await utils.get.owner();
  if (owner === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ owner: toBase58(owner) }));
};

const getToken = async(req, res) => {
  const { tokenId } = req.query;

  let token = await utils.get.token(tokenId);
  if (token === undefined) return res.status(500).json(resError(73500));

  token = (isNullAddress(token)) ? null : toBase58(token);
  res.json(resSuccess({ token }));
};

const getGame = async(req, res) => {
  const { gameId } = req.query;

  let game = await utils.get.game(gameId);
  if (game === undefined) return res.status(500).json(resError(73500));

  game = (isNullAddress(game)) ? null : toBase58(game);
  res.json(resSuccess({ game }));
};

const getGameStatus = async(req, res) => {
  const { address } = req.query;

  if (!isAddress(address) || isNullAddress(address))
    return res.status(422).json(resError(73402));

  const gameStatus = await utils.get.gameStatus(address);
  if (gameStatus === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ gameStatus }));
};

// Setters

const setMainStatus = async(req, res) => {
  const { status } = req.body;

  const result = await utils.set.mainStatus(status === 'true');
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setToken = async(req, res) => {
  const { tokenId, address } = req.body;

  if (!isAddress(address) || isNullAddress(address))
    return res.status(422).json(resError(73402));

  const result = await utils.set.token(tokenId, address);
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setGame = async(req, res) => {
  const { gameId, address } = req.body;

  if (!isAddress(address) || isNullAddress(address))
    return res.status(422).json(resError(73402));

  const result = await utils.set.game(gameId, address);
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setGameStatus = async(req, res) => {
  const { address, status } = req.body;

  if (!isAddress(address) || isNullAddress(address))
    return res.status(422).json(resError(73402));

  const result = await utils.set.gameStatus(address, status === 'true');
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

// Functions

const takeTRXBet = async(req, res) => {
  const { amount, gameId, data } = req.body;

  const result = await utils.payable.takeTRXBet(toSun(amount), gameId, data);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess({ result }));
};

const withdraw = async(req, res) => {
  const { amount, tokenId } = req.body;

  const result = await utils.withdraw(toSun(amount), tokenId);
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

// Events

const mainStatus = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.mainStatus();
  if (!events) return res.status(500).json(resError(73500));
  for (const event of events) {
    event.result.mainStatus = (event.result.mainStatus === 'true');
  }

  events = filterEvents(events, from, to);
  res.json(resSuccess({ events }));
};

const withdraws = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.withdraws();
  if (!events) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    event.result.amount = toTRX(event.result.amount);
  }

  res.json(resSuccess({ events }));
};

const tokens = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.tokens();
  if (!events) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    event.result.contractAddress = toBase58(event.result.contractAddress);
  }

  res.json(resSuccess({ events }));
};

const games = async(req, res) => {
  const { from, to } = req.query;

  const games = await utils.events.games();
  if (!games) return res.status(500).json(resError(73500));
  const gamesStatuses = await utils.events.gamesStatuses();
  if (!gamesStatuses) return res.status(500).json(resError(73500));

  for (const event of gamesStatuses) {
    event.result.status = (event.result.status === 'true');
  }

  const events = filterEvents(games.concat(gamesStatuses), from, to);
  for (const event of events) {
    event.result.contractAddress = toBase58(event.result.contractAddress);
  }

  res.json(resSuccess({ events }));
};

const rewards = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.rewards();
  if (!events) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    const { reward, tokenId, to } = event.result;
    if (tokenId === '0') event.result.reward = toTRX(reward);
    event.result.to = toBase58(to);
  }

  res.json(resSuccess({ events }));
};

module.exports = {
  get: {
    balance,
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
  func: {
    takeTRXBet,
    withdraw,
  },
  events: {
    mainStatus,
    withdraws,
    tokens,
    games,
    rewards,
  },
};
