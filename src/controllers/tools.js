const utils = require('@utils/withdraw');
const models = require('@models/tools');
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

// Functions

const request = async(req, res) => {
  const { code } = req.body;

  const result = await utils.func.request(code);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

// Events

const operation = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.operation();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.operation, from, to);

  res.json(resSuccess({ events }));
};

module.exports = {
  func: {
    request,
  },
  events: {
    withdraw: operation,
  },
};
