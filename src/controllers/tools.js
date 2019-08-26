const db = require('@db');

const { getBlock } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

const getContracts = async(_req, res) => {
  const contracts = await db.contracts.getAll();
  successRes(res, { contracts });
};

const getFunds = async(_req, res) => {
  const funds = await db.funds.getAll();
  successRes(res, { funds });
};

const block = async(req, res) => {
  const { index } = req.query;

  try {
    const hash = (await getBlock(index)).blockID;
    successRes(res, { number: index, hash: `0x${hash}` });
  } catch {
    errorRes(res, 500, 73500);
  }
};

module.exports = {
  getContracts,
  getFunds,
  block,
};
