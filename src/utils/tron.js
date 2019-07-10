const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const toBase58 = (address) => tronWeb.address.fromHex(address);

module.exports = {
  toBase58,
};
