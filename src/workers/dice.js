const utils = require('@utils/dice');
const models = require('@models/dice');

const takePart = async(blockNumber, io) => {
  const payload = await utils.events.takeBet(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.takeBets(item.result);
    io.in('dice').emit('take-part', event);
  }
};

const finish = async(blockNumber, io) => {
  const payload = await utils.events.finishGame(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.finishGame(item.result);
    io.in('dice').emit('finish', event);
  }
};

const reward = async(blockNumber, io) => {
  const payload = await utils.events.playersWin(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.playerWin(item.result);
    io.in('dice').emit('reward', event);
  }
};

module.exports = async(number, io) => {
  takePart(number, io);
  finish(number, io);
  reward(number, io);
};
