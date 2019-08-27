const db = require('@db');
const { send } = require('@utils/tron');

const address = db.contracts.get({ type: 'portal' });

const transferBOMB = (to, amount, privateKey) =>
  send('transfer', address, privateKey)(to, amount);

const freeze = (amount, privateKey) =>
  send('freeze', address, privateKey)(amount);

module.exports = {
  transferBOMB,
  freeze,
};
