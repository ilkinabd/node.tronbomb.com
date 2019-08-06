const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');
const { send, events } = require('@utils/tron');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const address = db.contracts.get({ type: 'withdraw' });
const contract = async() => tronWeb.contract().at(await address);

module.exports = {
  func: {
    withdraw: send('withdraw', contract),
  },
  events: {
    operation: events('Operation', address),
  },
};
