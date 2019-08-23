const { sendTRX, isAddress, getBlock } = require('@utils/tron');
const { resSuccess, resError } = require('@utils/res-builder');

// Getters

const block = async(req, res) => {
  const { id } = req.query;

  try {
    const hash = (await getBlock(id)).blockID;
    res.json(resSuccess({ number: id, hash }));
  } catch {
    return res.status(500).json(resError(73500));
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
  get: {
    block,
  },
  func: {
    withdraw,
  },
};
