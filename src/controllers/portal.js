const utils = require('@utils/portal');
const models = require('@models/portal');
const { toSun, isAddress, isNullAddress } = require('@utils/tron');
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

const games = async(_req, res) => {
  const requests = [];
  for (let i = 0; i < 10; i++) requests.push(utils.get.game(i));

  const payload = await Promise.all(requests).catch(console.error);
  if (!payload) return errorRes(res, 500, 73500);

  const games = Array
    .from(payload, (address, index) => ({ address, index }))
    .filter(game => !isNullAddress(game.address));

  for (const i in games) {
    games[i].status = await utils.get.gameStatuses(games[i].address);
    games[i] = models.contractParams(games[i]);
  }

  successRes(res, { games });
};

const balance = async(_req, res) => {
  const balance = await utils.get.balance();
  if (balance === undefined) return res.status(500).json(resError(73500));

  res.json(resSuccess({ balance }));
};

const getMainStatus = async(_req, res) => {
  const mainStatus = await utils.get.mainStatus();
  if (mainStatus === undefined) return res.status(500).json(resError(73500));

  res.json(resSuccess({ mainStatus }));
};

const getOwner = async(_req, res) => {
  const payload = await utils.get.owner();
  if (!payload) return res.status(500).json(resError(73500));

  const owner = models.address(payload);

  res.json(resSuccess({ owner }));
};

const getToken = async(req, res) => {
  const { id } = req.query;

  const payload = await utils.get.token(id);
  if (!payload) return res.status(500).json(resError(73500));

  const token = models.address(payload);

  res.json(resSuccess({ token }));
};

// Setters

const setMainStatus = async(req, res) => {
  const { status } = req.body;

  const result = await utils.set.mainStatus(status === 'true');
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

const setToken = async(req, res) => {
  const { id, address } = req.body;

  if (!isAddress(address)) return res.status(422).json(resError(73402));

  const result = await utils.set.token(id, address);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

const setGame = async(req, res) => {
  const { id, address } = req.body;

  if (!isAddress(address)) return res.status(422).json(resError(73402));

  const result = await utils.set.game(id, address);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

const setGameStatus = async(req, res) => {
  const { address, status } = req.body;

  if (!isAddress(address)) return res.status(422).json(resError(73402));

  const result = await utils.set.gameStatus(address, status === 'true');
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

// Functions

const takeTRXBet = async(req, res) => {
  const { amount, id, data } = req.body;

  const payload = await utils.func.takeTRXBet(toSun(amount), id, data);
  if (!payload) return res.status(500).json(resError(73500));

  const result = models.takeTRXBet(payload);

  res.json(resSuccess({ result }));
};

const withdraw = async(req, res) => {
  const { amount, id } = req.body;

  const result = await utils.func.withdraw(toSun(amount), id);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

// Events

const mainStatusEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.mainStatus();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.mainStatus, from, to);

  res.json(resSuccess({ events }));
};

const withdrawEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.withdraw();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.withdraw, from, to);

  res.json(resSuccess({ events }));
};

const tokenEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.token();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.contract, from, to);

  res.json(resSuccess({ events }));
};

const gameEvents = async(req, res) => {
  const { from, to } = req.query;

  const gamesPayload = await utils.events.game();
  if (!gamesPayload) return res.status(500).json(resError(73500));
  const games = filterEvents(gamesPayload, models.contract, from, to);

  const statusesPayload = await utils.events.gamesStatus();
  if (!statusesPayload) return res.status(500).json(resError(73500));
  const statuses = filterEvents(statusesPayload, models.mainStatus, from, to);

  const events = games.concat(statuses);

  res.json(resSuccess({ events }));
};

const rewardEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.reward();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.reward, from, to);

  res.json(resSuccess({ events }));
};

module.exports = {
  get: {
    games,
    balance,
    mainStatus: getMainStatus,
    owner: getOwner,
    token: getToken,
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
    mainStatus: mainStatusEvents,
    withdraw: withdrawEvents,
    token: tokenEvents,
    game: gameEvents,
    reward: rewardEvents,
  },
};
