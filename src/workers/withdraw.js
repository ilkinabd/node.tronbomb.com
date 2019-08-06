const utils = require('@utils/withdraw');
const models = require('@models/tools');

const withdraw = async(blockNumber, chanel) => {
  const payload = await utils.events.withdraw(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.operation(item.result);
    chanel.emit('withdraw', event);
  }
};

module.exports = async(number, chanel) => {
  withdraw(number, chanel);
};
