const db = require('@db');
const utils = require('@utils/bomb');
const models = require('@models/bomb');

const transfer = async(block, chanel) => {
  const payload = await utils.events.transfer(block);
  if (!payload) return setTimeout(() => transfer(block, chanel), 1000);

  const type = 'auction';
  const { address } = await db.funds.get({ type });

  for (const item of payload) {
    const { amount, from, to } = models.transferEvent(item.result);
    if (to === address) chanel.emit('auction-bet', { amount, wallet: from });
  }
};

module.exports = async(block, chanel) => {
  transfer(block, chanel);
};
