const db = require('@db');

const { sendTRX, isAddress, getBlock } = require('@utils/tron');
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
  withdraw,
};
