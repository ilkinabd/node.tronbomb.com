const utils = require("@utils/wallet");
const models = require("@models/wallet");

const chargeWallet = async (block, chanel) => {
  try {
    const payload = await utils.events.charge(block);
    if (!payload) return setTimeout(() => chargeWallet(block, chanel), 1000);

    for (const item of payload) {
      const event = models.charge(item.result);
      console.log("Charge event is :");
      console.debug(event);
      chanel.emit("charge-wallet", event);
    }
  } catch (err) {
    console.debug(err);
  }
};

const withdrawWallet = async (block, chanel) => {
  try {
    const payload = await utils.events.withdraw(block);
    if (!payload) return setTimeout(() => withdrawWallet(block, chanel), 1000);

    for (const item of payload) {
      const event = models.withdraw(item.result);
      console.log("Withdraw event is :");
      console.debug(event);
      chanel.emit("withdraw-wallet", event);
    }
  } catch (err) {
    console.debug(err);
  }
};


module.exports = async (block, chanel) => {
  chargeWallet(block, chanel);
  withdrawWallet(block, chanel);
};
