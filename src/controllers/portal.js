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

  const result = await utils.control.setMainStatus({ status });
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

const balance = async(_req, res) => {
  const balance = await utils.balance();
  if (balance === null || balance === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ balance }));
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

module.exports = {
  getMainStatus,
  setMainStatus,
  getOwner,
  balance,
  events: {
    mainStatus,
  }
};
