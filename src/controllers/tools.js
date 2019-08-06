const utils = require('@utils/withdraw');
const { sendTRX, isAddress } = require('@utils/tron');
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

const withdraw = async(req, res) => {
  const { userWallet, wallet, amount } = req.body;

  if (!isAddress(wallet)) return res.status(422).json(resError(73402));

  console.info(`Withdraw ${amount} from ${userWallet} to ${wallet}`);
  const answer = await sendTRX(wallet, amount);
  if (!answer || !answer.result) return res.status(500).json(resError(73500));

  res.json(resSuccess({ txID: answer.transaction.txID }));
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
    withdraw,
  },
  events: {
    withdraw: operation,
  },
};
