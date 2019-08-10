const utils = require('@utils/wheel');
const models = require('@models/wheel');

const takePart = async(blockNumber, chanel) => {
  const payload = await utils.events.takeBet(blockNumber);
  if (!payload) {
    setInterval(() => takePart(blockNumber, chanel), 1000);
    return;
  }

  for (const item of payload) {
    const event = models.takeBet(item.result);
    chanel.emit('wheel-take-part', event);
  }
};

const reward = async(blockNumber, chanel) => {
  const payload = await utils.events.playerWin(blockNumber);
  if (!payload) {
    setInterval(() => reward(blockNumber, chanel), 1000);
    return;
  }

  for (const item of payload) {
    const event = models.playerWin(item.result);
    chanel.emit('wheel-reward', event);
  }
};

module.exports = (number, chanel) => {
  takePart(number, chanel);
  reward(number, chanel);
};
