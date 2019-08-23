const utils = require('@utils/dice');
const models = require('@models/dice');

const takePart = async(block, chanel) => {
  const payload = await utils.events.takeBet(block);
  if (!payload) return setTimeout(() => takePart(block, chanel), 1000);

  for (const item of payload) {
    const event = models.takeBet(item.result);
    chanel.emit('dice-take-part', event);
  }
};

const reward = async(block, chanel) => {
  const payload = await utils.events.playersWin(block);
  if (!payload) return setTimeout(() => reward(block, chanel), 1000);

  for (const item of payload) {
    const event = models.playerWin(item.result);
    chanel.emit('dice-reward', event);
  }
};

module.exports = async(block, chanel) => {
  takePart(block, chanel);
  reward(block, chanel);
};
