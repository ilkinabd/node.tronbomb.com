const utils = require('@utils/dice');
const models = require('@models/dice');

const takePart = async(blockNumber, chanel) => {
  const payload = await utils.events.takeBet(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.takeBets(item.result);
    chanel.emit('take-part', event);
  }
};

const finish = async(blockNumber, chanel) => {
  const payload = await utils.events.finishGame(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.finishGame(item.result);
    chanel.emit('finish', event);
  }
};

const reward = async(blockNumber, chanel) => {
  const payload = await utils.events.playersWin(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.playerWin(item.result);
    chanel.emit('reward', event);
  }
};

module.exports = async(number, chanel) => {
  takePart(number, chanel);
  finish(number, chanel);
  reward(number, chanel);
};
