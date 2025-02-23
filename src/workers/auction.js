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
    if (to !== address) continue;

    const event = {
      bet: amount,
      wallet: from,
    };

    chanel.emit('auction-bet', event);
  }
};

module.exports = async(block, chanel) => {
  transfer(block, chanel);
};
