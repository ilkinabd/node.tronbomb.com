const db = require('@db');
const { call, send, payable, events } = require('@utils/tron');

const address = db.contracts.get({ type: 'operations' });

module.exports = {
  get: {
    address: () => address,
    owner: call('owner', address),
  },
  func: {
    withdraw: payable('withdraw', address),
    referralProfit: send('withdrawReferralProfit', address),
    dividends: send('withdrawDividends', address),
    mine: send('mine', address),
  },
  events: {
    withdraw: events('Withdraw', address),
    referralProfit: events('WithdrawReferralProfit', address),
    dividends: events('WithdrawDividends', address),
  },
};
