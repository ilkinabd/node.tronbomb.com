const utils = require('@utils/dice');
const models = require('@models/dice');

const takePart = async(blockNumber, chanel) => {
  const payload = await utils.events.takeBet(blockNumber);
  if (!payload) return setTimeout(() => takePart(blockNumber, chanel), 1000);

  for (const item of payload) {
    const event = models.takeBets(item.result);
    chanel.emit('dice-take-part', event);
  }
};

const reward = async(blockNumber, chanel) => {
  const payload = await utils.events.playersWin(blockNumber);
  if (!payload) return setTimeout(() => reward(blockNumber, chanel), 1000);

  for (const item of payload) {
    const event = models.playerWin(item.result);
    chanel.emit('dice-reward', event);
  }
};

module.exports = async(number, chanel) => {
  takePart(number, chanel);
  reward(number, chanel);
};
