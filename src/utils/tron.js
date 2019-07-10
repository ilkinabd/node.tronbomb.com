const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const toBase58 = (address) => tronWeb.address.fromHex(address);
const toTRX = (amount) => tronWeb.fromSun(amount);
const toSun = (amount) => tronWeb.toSun(amount);

module.exports = {
  toBase58,
  toTRX,
  toSun,
};
