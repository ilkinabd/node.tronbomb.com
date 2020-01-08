const db = require('@db');
const { events, send } = require('@utils/tron');

const address = db.contracts.get({ type: 'wallet' });

module.exports = {
  func: {
    withdraw: send('withdrawTRX', address),
  },
  events: {
    charge: events('Charge', address),
    withdraw: events('Withdraw', address),
  },
};
