const { FULL, SOLIDITY, EVENT, PRIVATE_KEY } = process.env;

const TronWeb = require('tronweb');
const rollbar = require('@utils/rollbar');

const tronWeb = new TronWeb(FULL, SOLIDITY, EVENT, PRIVATE_KEY);
const nullAddress = '410000000000000000000000000000000000000000';

const toBase58 = tronWeb.address.fromHex;
const toDecimal = tronWeb.toDecimal;
const toAscii = tronWeb.toAscii;
const toHex = tronWeb.address.toHex;
const isAddress = tronWeb.isAddress;
const getBlock = async(number) => await tronWeb.trx.getBlock(number);
const isNullAddress = (address) => (address === nullAddress);
const toTRX = (amount) => parseFloat(tronWeb.fromSun(toDecimal(amount)));
const toSun = (amount) => parseFloat(tronWeb.toSun(amount));

const call = (variable, address) => async(...params) => {
  const contract = await tronWeb.contract().at(await address);

  let result = '';
  try {
    result = await contract[variable](...params).call()
  } catch (e) {
    console.error(e);
    rollbar.error(e.message);
    console.error('variable: ', variable);
    console.log('params: ', params);
  }

  return result;
};

const send = (method, address, key = PRIVATE_KEY, shouldPollResponse = true) =>
  async(...params) => {
    const contract = await tronWeb.contract().at(await address);
    tronWeb.setPrivateKey(key);

    const result = await contract[method](...params).send({
      shouldPollResponse,
    }).catch((payload) => {
      console.error(payload);
      rollbar.error(payload);
      const output = payload.output.contractResult[0];
      const message = output.slice(136, output.indexOf('2e') + 2);
      const error = (!message) ? 'FAILED.' : toAscii(message);
      return { error };
    });

    return result;
  };

const payable = (method, address, key = PRIVATE_KEY) =>
  async(amount, ...params) => {
    const contract = await tronWeb.contract().at(await address);
    tronWeb.setPrivateKey(key);

    const result = await contract[method](...params).send({
      shouldPollResponse: true,
      callValue: amount,
    }).catch((payload) => {
      console.error(payload);
      rollbar.error(payload);
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
  }).catch((e) => {
    console.log(e);
    rollbar.error(e);
  });

  if (events.length > 0)
    rollbar.info(`New event: ${JSON.stringify(events)}`);

  return events;
};

const balance = async(address) => toTRX(await tronWeb.trx.getBalance(address));

const currentBlock = async() => {
  const response = await tronWeb.trx.getCurrentBlock()
    .catch(rollbar.error);

  return response.block_header.raw_data.number;
};

const sendTRX = async(to, amount, privateKey = PRIVATE_KEY) => {
  let result = null;
  try {
    result = tronWeb.trx.sendTransaction(toHex(to), toSun(amount), privateKey);
  } catch (e) {
    rollbar.error(e);
  }

  return result;
};

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
