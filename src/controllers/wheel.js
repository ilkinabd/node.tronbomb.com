const dice = require('@utils/wheel');
const {
  toBase58, toTRX, toSun, isAddress, isNullAddress
} = require('@utils/tron');
const { resSuccess, resError } = require('@utils/res-builder');

const filterEvents = (events, from, to) => (events.filter((event) => (
  (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
)));

// Getters

const getParams = async(_req, res) => {
  const portal = toBase58(await dice.get.portal());
  const minBet = toTRX(await dice.get.minBet());
  const maxBet = toTRX(await dice.get.maxBet());

  res.json(resSuccess({ portal, minBet, maxBet }));
};

// Setters

const setPortal = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address) || isNullAddress(address))
    return res.status(422).json(resError(73402));

  const result = await dice.set.portal(address);
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setBet = async(req, res) => {
  const { min, max } = req.body;

  const result = await dice.set.bet(toSun(min), toSun(max));
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

// Functions

// Events

const changeParams = async(req, res) => {
  const { from, to } = req.query;

  let events = await dice.events.changeMinMaxBet();
  if (!events) return res.status(500).json(resError(73500));
  events = filterEvents(events, from, to);
  for (const event of events) {
    event.result.minBet = toTRX(event.result.minBet);
    event.result.maxBet = toTRX(event.result.maxBet);
  }

  res.json(resSuccess({ events }));
};

module.exports = {
  get: {
    params: getParams,
  },
  set: {
    portal: setPortal,
    bet: setBet,
  },
  events: {
    changeParams,
  },
};
