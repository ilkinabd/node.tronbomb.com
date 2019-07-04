const utils = require('@utils/portal');
const { success: resSuccess, error: resError } = require('@utils/res-builder');

const getMainStatus = async(_req, res) => {
  const mainStatus = await utils.control.getMainStatus();
  if (mainStatus === null || mainStatus === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ mainStatus }));
};

const setMainStatus = async(req, res) => {
  const { status } = req.body;

  const result = await utils.control.setMainStatus(status);
  if (result === null || result === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ result }));
};

const getOwner = async(_req, res) => {
  const owner = await utils.control.getOwner();
  if (owner === null || owner === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ owner }));
};

const getToken = async(req, res) => {
  const { tokenId } = req.query;

  const token = await utils.control.getToken(tokenId);
  if (token === null || token === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ token }));
};

const setToken = async(req, res) => {
  const { tokenId, address } = req.body;

  const result = await utils.control.setToken(tokenId, address);
  if (result === null || result === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ result }));
};

const getGame = async(req, res) => {
  const { gameId } = req.query;

  const game = await utils.control.getGame(gameId);
  if (game === null || game === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ game }));
};

const setGame = async(req, res) => {
  const { gameId, address } = req.body;

  const result = await utils.control.setGame(gameId, address);
  if (result === null || result === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ result }));
};

const getGameStatus = async(req, res) => {
  const { address } = req.query;

  const gameStatus = await utils.control.getGameStatus(address);
  if (gameStatus === null || gameStatus === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ gameStatus }));
};

const setGameStatus = async(req, res) => {
  const { address, status } = req.body;

  const result = await utils.control.setGameStatus(address, status);
  if (result === null || result === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ result }));
};

const balance = async(_req, res) => {
  const balance = await utils.balance();
  if (balance === null || balance === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ balance }));
};

const withdraw = async(req, res) => {
  const { amount, tokenId } = req.body;

  const result = await utils.withdraw(amount * 10 ** 6, tokenId);
  if (result === null || result === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ result }));
};

// Payable

const takeTRXBet = async(req, res) => {
  const { amount, gameId, data } = req.body;

  const result = await utils.payable.takeTRXBet(amount * 10 ** 6, gameId, data);
  if (result === null || result === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ result }));
};

// Events

const mainStatus = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.mainStatus();
  if (events === null || events === undefined)
    return res.status(500).json(resError(73500));

  events = events.filter((event) => (
    (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
  ));

  res.json(resSuccess({ events }));
};

const withdraws = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.withdraws();
  if (events === null || events === undefined)
    return res.status(500).json(resError(73500));

  events = events.filter((event) => (
    (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
  ));

  res.json(resSuccess({ events }));
};

const tokens = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.tokens();
  if (events === null || events === undefined)
    return res.status(500).json(resError(73500));

  events = events.filter((event) => (
    (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
  ));

  res.json(resSuccess({ events }));
};

const games = async(req, res) => {
  const { from, to } = req.query;

  const games = await utils.events.games();
  if (games === null || games === undefined)
    return res.status(500).json(resError(73500));

  const gamesStatuses = await utils.events.gamesStatuses();
  if (gamesStatuses === null || gamesStatuses === undefined)
    return res.status(500).json(resError(73500));

  const events = games.concat(gamesStatuses).filter((event) => (
    (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
  ));

  res.json(resSuccess({ events }));
};

const rewards = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.rewards();
  if (events === null || events === undefined)
    return res.status(500).json(resError(73500));

  events = events.filter((event) => (
    (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
  ));

  res.json(resSuccess({ events }));
};

module.exports = {
  getMainStatus,
  setMainStatus,
  getOwner,
  balance,
  withdraw,
  getToken,
  setToken,
  getGame,
  setGame,
  getGameStatus,
  setGameStatus,
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
