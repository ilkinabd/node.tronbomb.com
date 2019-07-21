const utils = require('@utils/wheel');
const {
  toBase58, toTRX, toSun, isAddress, isNullAddress, toDecimal
} = require('@utils/tron');
const { resSuccess, resError } = require('@utils/res-builder');

const filterEvents = (events, from, to) => (events.filter((event) => (
  (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
)));

// Getters

const getParams = async(_req, res) => {
  const portal = toBase58(await utils.get.portal());
  const minBet = toTRX(await utils.get.minBet());
  const maxBet = toTRX(await utils.get.maxBet());
  const duration = parseInt(await utils.get.duration());

  res.json(resSuccess({ portal, minBet, maxBet, duration }));
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

const initGame = async(_req, res) => {
  const result = await utils.func.init();
  if (!result) return res.status(500).json(resError(73500));
  result.gameId = toDecimal(result.gameId);
  res.json(resSuccess({ result }));
};

// Events

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
    params: getParams,
  },
  set: {
    portal: setPortal,
    bet: setBet,
    duration: setDuration
  },
  func: {
    init: initGame,
  },
  events: {
    changeParams,
  },
};
