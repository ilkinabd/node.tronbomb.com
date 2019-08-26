const db = require('@db');

const { getBlock, balance } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

const getContracts = async(_req, res) => {
  const contracts = await db.contracts.getAll();
  successRes(res, { contracts });
};

const getFunds = async(_req, res) => {
  const funds = await db.funds.getAll();
  successRes(res, { funds });
};

const portalBalance = async(_req, res) => {
  const address = await db.contracts.get({ type: 'portal' });
  const balanceTRX = await balance(address);
  successRes(res, { balanceTRX });
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
  portalBalance,
  block,
};
