const utils = require('@utils/wheel');
const models = require('@models/wheel');

const start = async(blockNumber, io) => {
  const payload = await utils.events.initGame(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.initGame(item.result);
    io.in('wheel').emit('start', event);
  }
};

const takePart = async(blockNumber, io) => {
  const payload = await utils.events.takeBet(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.takeBet(item.result);
    io.in('wheel').emit('take-part', event);
  }
};

const finish = async(blockNumber, io) => {
  const payload = await utils.events.finishGame(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.finishGame(item.result);
    io.in('wheel').emit('finish', event);
  }
};

const reward = async(blockNumber, io) => {
  const payload = await utils.events.playerWin(blockNumber);
  if (!payload) return;

  for (const item of payload) {
    const event = models.playerWin(item.result);
    io.in('wheel').emit('reward', event);
  }
};

module.exports = (number, io) => {
  start(number, io);
  takePart(number, io);
  finish(number, io);
  reward(number, io);
};
