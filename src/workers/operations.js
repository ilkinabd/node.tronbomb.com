const utils = require('@utils/operations');
const models = require('@models/operations');

const withdraw = async(block, chanel) => {
  const payload = await utils.events.withdraw(block);
  if (!payload) return setTimeout(() => withdraw(block, chanel), 1000);

  for (const item of payload) {
    const event = models.withdraw(item.result);
    chanel.emit('withdraw', event);
  }
};

const referralProfit = async(block, chanel) => {
  const payload = await utils.events.referralProfit(block);
  if (!payload) return setTimeout(() => referralProfit(block, chanel), 1000);

  console.log('withdraw-referral-profit', payload);
  for (const item of payload) {
    console.log('item', item);
    const event = models.wallet(item.result);
    chanel.emit('withdraw-referral-profit', event);
  }
};

const dividends = async(block, chanel) => {
  const payload = await utils.events.dividends(block);
  if (!payload) return setTimeout(() => dividends(block, chanel), 1000);

  for (const item of payload) {
    const event = models.wallet(item.result);
    chanel.emit('withdraw-dividends', event);
  }
};

const mine = async(block, chanel) => {
  const payload = await utils.events.mine(block);
  if (!payload) return setTimeout(() => mine(block, chanel), 1000);

  for (const item of payload) {
    const event = models.wallet(item.result);
    chanel.emit('mine', event);
  }
};

module.exports = async(block, chanel) => {
  withdraw(block, chanel);
  referralProfit(block, chanel);
  dividends(block, chanel);
  mine(block, chanel);
};
