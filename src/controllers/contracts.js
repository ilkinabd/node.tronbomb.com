const db = require('@db');

const { resSuccess, resError } = require('@utils/res-builder');

const getAll = async(_req, res) => {
  const contracts = await db.contracts.getAll();
  if (contracts.length === 0) return res.status(500).json(resError(73500));

  res.json(resSuccess({ contracts }));
};

module.exports = {
  getAll,
};
