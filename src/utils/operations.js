const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');
const { call, send, payable } = require('@utils/tron');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const address = db.contracts.get({ type: 'operations' });
const contract = async() => tronWeb.contract().at(await address);

module.exports = {
  get: {
    address: () => address,
    owner: call('owner', contract),
  },
  func: {
    withdraw: payable('withdraw', contract),
    referralProfit: send('withdrawReferralProfit', contract),
    dividends: send('withdrawDividends', contract),
  },
};
