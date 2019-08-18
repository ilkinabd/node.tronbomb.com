const db = require('@db');

const { successRes } = require('@utils/res-builder');

const getAll = async(_req, res) => {
  const contracts = await db.contracts.getAll();
  successRes(res, { contracts });
};

module.exports = {
  getAll,
};
