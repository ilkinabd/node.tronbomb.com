const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);
const nullAddress = '410000000000000000000000000000000000000000';

const toBase58 = (address) => tronWeb.address.fromHex(address);
const toDecimal = (amount) => tronWeb.toDecimal(amount);
const toTRX = (amount) => parseFloat(tronWeb.fromSun(toDecimal(amount)));
const toSun = (amount) => parseFloat(tronWeb.toSun(amount));
const isAddress = (address) => tronWeb.isAddress(address);
const isNullAddress = (address) => (address === nullAddress);

const getBalance = async(address) =>
  toTRX(await tronWeb.trx.getBalance(address));

const currentBlock = async() =>
  (await tronWeb.trx.getCurrentBlock()).block_header.raw_data.number;
const block = (number) => tronWeb.trx.getBlock(number);

module.exports = {
  toBase58,
  toDecimal,
  toTRX,
  toSun,
  isAddress,
  isNullAddress,
  getBalance,
  currentBlock,
  block,
};
