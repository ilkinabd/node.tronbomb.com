const utils = require('@utils/bomb');
const models = require('@models/bomb');

const burn = async(block, chanel) => {
  const payload = await utils.events.burn(block);
  if (!payload) return setTimeout(() => burn(block, chanel), 1000);

  for (const item of payload) {
    const event = models.burnEvent(item.result);
    event.hash = item.transaction;
    chanel.emit('bomb-burn', event);
  }
};

const freeze = async(block, chanel) => {
  const payload = await utils.events.freeze(block);
  if (!payload) return setTimeout(() => freeze(block, chanel), 1000);

  for (const item of payload) {
    const event = models.freezeEvent(item.result);
    event.hash = item.transaction;
    chanel.emit('bomb-freeze', event);
  }
};

const unfreeze = async(block, chanel) => {
  const payload = await utils.events.unfreeze(block);
  if (!payload) return setTimeout(() => unfreeze(block, chanel), 1000);

  for (const item of payload) {
    const event = models.freezeEvent(item.result);
    event.hash = item.transaction;
    chanel.emit('bomb-unfreeze', event);
  }
};

module.exports = async(block, chanel) => {
  burn(block, chanel);
  freeze(block, chanel);
  unfreeze(block, chanel);
};
