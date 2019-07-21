const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const toBase58 = (address) => tronWeb.address.fromHex(address);
const toTRX = (amount) => parseFloat(tronWeb.fromSun(amount));
const toSun = (amount) => parseFloat(tronWeb.toSun(amount));
const isAddress = (address) => tronWeb.isAddress(address);
const isNullAddress = (address) =>
  (address === '410000000000000000000000000000000000000000');

const getBalance = async(address) =>
  toTRX(await tronWeb.trx.getBalance(address));

module.exports = {
  toBase58,
  toTRX,
  toSun,
  isAddress,
  isNullAddress,
  getBalance,
};
