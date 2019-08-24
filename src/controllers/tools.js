const db = require('@db');

const bombUtils = require('@utils/bomb');
const { sendTRX, balance, isAddress, getBlock } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

const getContracts = async(_req, res) => {
  const contracts = await db.contracts.getAll();
  successRes(res, { contracts });
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

const fundBalance = async(req, res) => {
  const { type } = req.query;

  const { address } = await db.funds.get({ type });
  if (!address) return errorRes(res, 422, 73407);

  const balanceTRX = await balance(address);
  const payload = await bombUtils.get.balanceOf(address);
  const balanceBOMB = payload.amount / 10 ** 6;

  successRes(res, { address, type, balanceTRX, balanceBOMB });
};

const fundBalances = async(_req, res) => {
  const fundsData = await db.funds.getAll();

  const requests = [];
  for (const { address, type } of fundsData) requests.push((async() => ({
    address,
    type,
    balanceTRX: await balance(address),
    balanceBOMB: (await bombUtils.get.balanceOf(address)).amount / 10 ** 6,
  }))());

  const funds = await Promise.all(requests).catch(console.error);

  successRes(res, { funds });
};

const withdraw = async(req, res) => {
  const { to, amount } = req.body;

  if (!isAddress(to)) return errorRes(res, 422, 73402);

  console.info(`Withdraw ${amount} to ${to}`);
  const answer = await sendTRX(to, amount);
  if (!answer || !answer.result) errorRes(res, 500, 73500);

  successRes(res, { txID: answer.transaction.txID });
};

module.exports = {
  getContracts,
  block,
  fundBalance,
  fundBalances,
  withdraw,
};
