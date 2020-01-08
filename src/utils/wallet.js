const db = require('@db');
const { events } = require('@utils/tron');

const address = db.contracts.get({ type: 'wallet' });

module.exports = {
  events: {
    charge: events('Charge', address),
    withdraw: events('Withdraw', address),
  },
};
