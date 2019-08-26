const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');
const { send } = require('@utils/tron');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const address = db.contracts.get({ type: 'portal' });
const contract = async() => tronWeb.contract().at(await address);

const transferBOMB = (to, amount, privateKey) =>
  send('transfer', contract, privateKey)(to, amount);

module.exports = {
  transferBOMB,
};
