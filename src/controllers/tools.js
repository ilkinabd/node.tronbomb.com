const db = require('@db');

const { sendTRX, isAddress, getBlock } = require('@utils/tron');
const {
  successRes, errorRes, resSuccess, resError
} = require('@utils/res-builder');

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
  const { wallet, to, amount } = req.body;

  if (!isAddress(to)) return res.status(422).json(resError(73402));

  console.info(`Withdraw ${amount} from ${wallet} to ${to}`);
  const answer = await sendTRX(to, amount);
  if (!answer || !answer.result) return res.status(500).json(resError(73500));

  res.json(resSuccess({ txID: answer.transaction.txID }));
};

module.exports = {
  getContracts,
  block,
  func: {
    withdraw,
  },
};
