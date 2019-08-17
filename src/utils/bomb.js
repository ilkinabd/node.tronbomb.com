const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');
const { call } = require('@utils/tron');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const address = db.contracts.get({ type: 'token' });
const contract = async() => tronWeb.contract().at(await address);

module.exports = {
  get: {
    balanceOf: call('balanceOf', contract),
    allowance: call('allowance', contract),
    name: call('NAME', contract),
    symbol: call('SYMBOL', contract),
    decimal: call('DECIMAL', contract),
    totalSupply: call('totalSupply', contract),
    mintingFinished: call('mintingFinished', contract),
    totalBurned: call('totalBurned', contract),
  },
  set: {
  },
  func: {
  },
  events: {
  },
};
