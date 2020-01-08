const utils = require('@utils/wallet');
const { toDecimal } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

// Functions
const withdraw = async (req, res) => {
  try {
    console.log('Withdraw method called ');
    const { wallet: address, amount, isToken } = req.body;
    const value = toDecimal(amount);
    console.log(`Address is : ${address}\nAmount is : ${value}`);
    await utils.func.withdraw(address, value);
    successRes(res);
  } catch (error) {
    console.log('Error : ');
    console.log(error.message);
    errorRes(res, 500, 73501, error);
  }
};

// const rng = async (req, res) => {
//   console.log(`================ RNG method called ====================`);
//   const { address, block } = req.query;

//   console.log(`
//     Address is : ${address},
//     Block is : ${block}
//   `);

//   const hash = "0x" + (await getBlock(block)).blockID;
//   console.log(`Hash is ${hash}`);

//   const payload = await utils.func.rng(address, block, hash);
//   if (!payload) return errorRes(res, 500, 73500);
//   const model = models.rng(payload);

//   console.log("Rng model is : ");
//   console.debug(model);
//   successRes(res, model);
// };

// const finishGame = async (req, res) => {
//   const { index } = req.body;

//   const game = await utils.get.game(index);
//   if (!game) return errorRes(res, 500, 73500);
//   const block = toDecimal(game.finishBlock);
//   const hash = "0x" + (await getBlock(block)).blockID;

//   const result = await utils.func.finishGame(index, hash);
//   if (result.error) return errorRes(res, 500, 73501, result.error);

//   successRes(res);
// };

// // Events

// const takeBet = async (req, res) => {
//   const { from, to } = req.query;

//   const payload = await utils.events.takeBet();
//   if (!payload) return errorRes(res, 500, 73500);
//   const events = filterEvents(payload, models.takeBet, from, to);

//   successRes(res, { events });
// };

// const finishGameEvents = async (req, res) => {
//   const { from, to } = req.query;

//   const payload = await utils.events.finishGame();
//   if (!payload) return errorRes(res, 500, 73500);
//   const events = filterEvents(payload, models.finishGame, from, to);

//   successRes(res, { events });
// };

// const playersWin = async (req, res) => {
//   const { from, to } = req.query;

//   const payload = await utils.events.playersWin();
//   if (!payload) return errorRes(res, 500, 73500);
//   const events = filterEvents(payload, models.playerWin, from, to);

//   successRes(res, { events });
// };

// const setRTPEvents = async (req, res) => {
//   const { from, to } = req.query;

//   const payload = await utils.events.setRTP();
//   if (!payload) return errorRes(res, 500, 73500);
//   const events = filterEvents(payload, models.setRTP, from, to);

//   successRes(res, { events });
// };

module.exports = {
  func: {
    withdraw,
  },
};
