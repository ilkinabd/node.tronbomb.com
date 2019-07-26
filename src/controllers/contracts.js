const db = require('@db');

const { resSuccess } = require('@utils/res-builder');

const getAll = async(_req, res) => {
  const contracts = await db.contracts.getAll();
  res.json(resSuccess({ contracts }));
};

module.exports = {
  getAll,
};
