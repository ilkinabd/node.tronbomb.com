const utils = require('@utils/bomb');
const models = require('@models/bomb');

const burn = async(block, chanel) => {
  const payload = await utils.events.burn(block);
  if (!payload) return setTimeout(() => burn(block, chanel), 1000);

  for (const item of payload) {
    const event = models.burnEvent(item.result);
    chanel.emit('burn', event);
  }
};

module.exports = async(block, chanel) => {
  burn(block, chanel);
};
