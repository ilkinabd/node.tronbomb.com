const db = require('@db');

const bombUtils = require('@utils/bomb');
const utils = require('@utils/fund');
const { decrypt } = require('@utils/crypto');
const { sendTRX, balance, isAddress } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

const getBalance = async(req, res) => {
  const { type } = req.query;

  const { address } = await db.funds.get({ type });
  if (!address) return errorRes(res, 422, 73407);

  const balanceTRX = await balance(address);
  const payload = await bombUtils.get.balanceOf(address);
  const balanceBOMB = payload.amount / 10 ** 6;

  successRes(res, { address, type, balanceTRX, balanceBOMB });
};

const getBalances = async(_req, res) => {
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

const transferTRX = async(req, res) => {
  const { type, to } = req.body;
  const amount = parseFloat(req.body.amount.toFixed(6));

  const { address, encryptedKey } = await db.funds.get({ type });
  if (!address) return errorRes(res, 422, 73407);

  if (!isAddress(to)) return errorRes(res, 422, 73402);

  const privateKey = decrypt(encryptedKey);

  console.info(`Transfer ${amount} TRX to ${to} from ${type} fund.`);
  const answer = await sendTRX(to, amount, privateKey);
  if (!answer || !answer.result) errorRes(res, 500, 73500);

  successRes(res, { txID: answer.transaction.txID });
};

const transferBOMB = async(req, res) => {
  const { type, to } = req.body;
  const amount = Math.floor(req.body.amount * 10 ** 6);

  const { address, encryptedKey } = await db.funds.get({ type });
  if (!address) return errorRes(res, 422, 73407);

  if (!isAddress(to)) return errorRes(res, 422, 73402);

  const privateKey = decrypt(encryptedKey);

  console.info(`Transfer ${amount} BOMB to ${to} from ${type} fund.`);
  const result = await utils.transferBOMB(to, amount, privateKey);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const freezeAll = async(req, res) => {
  const { type } = req.body;

  const { address, encryptedKey } = await db.funds.get({ type });
  if (!address) return errorRes(res, 422, 73407);

  const { amount } = await bombUtils.get.balanceOf(address);
  const privateKey = decrypt(encryptedKey);

  console.info(`Freeze ${amount} BOMB from ${type} fund.`);
  const result = await utils.freeze(amount, privateKey);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

module.exports = {
  getBalance,
  getBalances,
  transferTRX,
  transferBOMB,
  freezeAll,
};
