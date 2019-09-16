const db = require('@db');
const { send } = require('@utils/tron');

const portal = db.contracts.get({ type: 'portal' });
const operations = db.contracts.get({ type: 'operations' });

const transferBOMB = (to, amount, privateKey) =>
  send('transfer', portal, privateKey, false)(to, amount);

const freeze = (amount, privateKey) =>
  send('freeze', portal, privateKey)(amount);

const mine = (privateKey) =>
  send('mine', operations, privateKey)();

module.exports = {
  transferBOMB,
  freeze,
  mine,
};
