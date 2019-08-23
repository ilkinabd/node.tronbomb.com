const utils = require('@utils/wheel');
const models = require('@models/wheel');

const takePart = async(block, chanel) => {
  const payload = await utils.events.takeBet(block);
  if (!payload) return setTimeout(() => takePart(block, chanel), 1000);

  for (const item of payload) {
    const event = models.takeBet(item.result);
    chanel.emit('wheel-take-part', event);
  }
};

const reward = async(block, chanel) => {
  const payload = await utils.events.playerWin(block);
  if (!payload) return setTimeout(() => reward(block, chanel), 1000);

  for (const item of payload) {
    const event = models.playerWin(item.result);
    chanel.emit('wheel-reward', event);
  }
};

module.exports = (block, chanel) => {
  takePart(block, chanel);
  reward(block, chanel);
};
