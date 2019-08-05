const utils = require('@utils/wheel');
const models = require('@models/wheel');

const start = async(blockNumber, chanel) => {
  const payload = await utils.events.initGame(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.initGame(item.result);
    chanel.emit('wheel-start', event);
  }
};

const takePart = async(blockNumber, chanel) => {
  const payload = await utils.events.takeBet(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.takeBet(item.result);
    chanel.emit('wheel-take-part', event);
  }
};

const finish = async(blockNumber, chanel) => {
  const payload = await utils.events.finishGame(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.finishGame(item.result);
    chanel.emit('wheel-finish', event);
  }
};

const reward = async(blockNumber, chanel) => {
  const payload = await utils.events.playerWin(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.playerWin(item.result);
    chanel.emit('wheel-reward', event);
  }
};

module.exports = (number, chanel) => {
  start(number, chanel);
  takePart(number, chanel);
  finish(number, chanel);
  reward(number, chanel);
};
