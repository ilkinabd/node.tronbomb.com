const db = require('@db');

const { getBlock, balance } = require('@utils/tron');
const bombUtils = require('@utils/bomb');
const { toDecimal } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

const getContracts = async (_req, res) => {
  const contracts = await db.contracts.getAll();
  successRes(res, { contracts });
};

const getFunds = async (_req, res) => {
  const funds = await db.funds.getAll();
  successRes(res, { funds });
};

const portalBalance = async (_req, res) => {
  const address = await db.contracts.get({ type: 'portal' });
  const balanceTRX = await balance(address);
  successRes(res, { balanceTRX });
};

const totalMined = async (_req, res) => {
  const totalSupply = 100000000000000; //todo: if it works move to constants
  //toDecimal(await bombUtils.get.totalSupply());
  const owner = await bombUtils.get.owner(); //todo: maybe cache owner
  const balanceOfOwner = await bombUtils.get.balanceOf(owner);
  console.debug(balanceOfOwner.amount);
  const ownerBalance = toDecimal(balanceOfOwner.amount._hex);
  console.log('Balance of owner');
  console.debug(ownerBalance);
  const totalMined = (totalSupply - ownerBalance) / 10 ** 6;

  successRes(res, { totalMined });
};

const block = async (req, res) => {
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
  totalMined,
  block,
};
