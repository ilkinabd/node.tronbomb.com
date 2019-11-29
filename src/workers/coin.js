const utils = require("@utils/coin");
const models = require("@models/coin");

const takePart = async (block, chanel) => {
  try {
    const payload = await utils.events.takeBet(block);
    if (!payload) return setTimeout(() => takePart(block, chanel), 1000);

    for (const item of payload) {
      const event = models.takeBet(item.result);
      console.log("TakeBet event is :");
      console.debug(event);
      chanel.emit("coin-take-part", event);
      console.log("coin-take-part emitted");
    }
  } catch (err) {
    console.debug(err);
  }
};

const reward = async (block, chanel) => {
  const payload = await utils.events.playersWin(block);
  if (!payload) return setTimeout(() => reward(block, chanel), 1000);

  for (const item of payload) {
    const event = models.playerWin(item.result);
    console.log("PlayerWin event is : ");
    console.debug(event);
    chanel.emit("coin-reward", event);
    console.log("coin-reward emitted");
  }
};

module.exports = async (block, chanel) => {
  takePart(block, chanel);
  reward(block, chanel);
};
