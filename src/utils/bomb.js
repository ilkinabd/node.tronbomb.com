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
  },
  set: {
  },
  func: {
  },
  events: {
  },
};
