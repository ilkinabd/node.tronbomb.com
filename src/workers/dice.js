const utils = require('@utils/dice');
const models = require('@models/dice');

const takePart = async(blockNumber, chanel) => {
  const payload = await utils.events.takeBet(blockNumber);
  if (!payload) {
    setInterval(() => takePart(blockNumber, chanel), 1000);
    return;
  }

  for (const item of payload) {
    const event = models.takeBets(item.result);
    chanel.emit('dice-take-part', event);
  }
};

const finish = async(blockNumber, chanel) => {
  const payload = await utils.events.finishGame(blockNumber);
  if (!payload) {
    setInterval(() => finish(blockNumber, chanel), 1000);
    return;
  }

  for (const item of payload) {
    const event = models.finishGame(item.result);
    chanel.emit('dice-finish', event);
  }
};

const reward = async(blockNumber, chanel) => {
  const payload = await utils.events.playersWin(blockNumber);
  if (!payload) {
    setInterval(() => reward(blockNumber, chanel), 1000);
    return;
  }

  for (const item of payload) {
    const event = models.playerWin(item.result);
    chanel.emit('dice-reward', event);
  }
};

module.exports = async(number, chanel) => {
  takePart(number, chanel);
  finish(number, chanel);
  reward(number, chanel);
};
