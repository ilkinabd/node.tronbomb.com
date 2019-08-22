const { PRIVATE_KEY, REFERRAL_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);
const nullAddress = '410000000000000000000000000000000000000000';

const toBase58 = tronWeb.address.fromHex;
const toDecimal = tronWeb.toDecimal;
const toAscii = tronWeb.toAscii;
const toHex = tronWeb.address.toHex;
const getBlock = tronWeb.trx.getBlock;
const isAddress = tronWeb.isAddress;
const isNullAddress = (address) => (address === nullAddress);
const toTRX = (amount) => parseFloat(tronWeb.fromSun(toDecimal(amount)));
const toSun = (amount) => parseFloat(tronWeb.toSun(amount));

const call = (variable, contract) => async(...params) => {
  const result = await (await contract())[variable](...params).call()
    .catch(console.error);

  return result;
};

const send = (method, contract) => async(...params) => {
  const result = await (await contract())[method](...params).send({
    shouldPollResponse: true,
  }).catch((payload) => {
    console.error(payload);
    const output = payload.output.contractResult[0];
    const message = output.slice(136, output.indexOf('2e') + 2);
    const error = (!message) ? 'FAILED.' : toAscii(message);
    return { error };
  });

  return result;
};

const payable = (method, contract) => async(amount, ...params) => {
  const result = await (await contract())[method](...params).send({
    shouldPollResponse: true,
    callValue: amount,
  }).catch((payload) => {
    console.error(payload);
    const output = payload.output.contractResult[0];
    const message = output.slice(136, output.indexOf('2e') + 2);
    const error = (!message) ? 'FAILED.' : toAscii(message);
    return { error };
  });

  return result;
};

const events = (eventName, address) => async(blockNumber) => {
  const events = await tronWeb.getEventResult(await address, {
    eventName,
    blockNumber,
  }).catch(console.error);

  return events;
};

const balance = async(address) => toTRX(await tronWeb.trx.getBalance(address));

const currentBlock = async() =>
  (await tronWeb.trx.getCurrentBlock()).block_header.raw_data.number;

const sendTRX = async(to, amount) =>
  tronWeb.trx.sendTransaction(toHex(to), toSun(amount), REFERRAL_KEY);

module.exports = {
  call,
  send,
  payable,
  events,
  toBase58,
  toDecimal,
  toTRX,
  toSun,
  isAddress,
  isNullAddress,
  balance,
  currentBlock,
  getBlock,
  sendTRX,
};
