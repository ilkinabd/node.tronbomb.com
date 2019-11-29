const utils = require("@utils/coin");
const models = require("@models/coin");
const { toDecimal, isAddress, getBlock } = require("@utils/tron");
const { successRes, errorRes } = require("@utils/res-builder");

const filterEvents = (payload, model, from, to) => {
  const events = payload
    .filter(
      item =>
        (from || 0) <= item.timestamp && item.timestamp <= (to || Infinity)
    )
    .map(item => {
      item.data = model(item.result);

      delete item.result;
      delete item.contract;
      delete item.resourceNode;

      return item;
    });

  return events;
};

// Getters

const getGame = async (req, res) => {
  const { index } = req.query;

  const totalGames = toDecimal(await utils.get.totalGames());
  if (!totalGames) return errorRes(res, 500, 73500);

  if (index >= totalGames) return errorRes(res, 422, 73405);

  const payload = await utils.get.game(index);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.game(payload);

  successRes(res, model);
};

const getGames = async (req, res) => {
  const { from, to } = req.query;

  const totalGames = toDecimal(await utils.get.totalGames());
  if (!totalGames) return errorRes(res, 500, 73500);

  const first = from || 0;
  const last = Math.min(totalGames, to || totalGames);

  const requests = [];
  for (let id = first; id < last; id++) requests.push(utils.get.game(id));
  const payload = await Promise.all(requests).catch(console.error);

  const games = Array.from(payload, item => models.game(item));

  successRes(res, { games });
};

const getParams = async (_req, res) => {
  const requests = [];
  const params = ["portal", "totalGames", "rtp", "owner", "address"];

  for (const param of params) requests.push(utils.get[param]());
  const results = await Promise.all(requests).catch(console.error);
  if (!results) return errorRes(res, 500, 73500);

  const payload = {};
  for (const i in params) payload[params[i]] = results[i];
  const model = models.params(payload);

  successRes(res, model);
};

// Setters

const setPortal = async (req, res) => {
  const { address } = req.body;

  if (!isAddress(address)) return errorRes(res, 422, 73402);

  const result = await utils.set.portal(address);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const setRTP = async (req, res) => {
  const { rtp } = req.body;

  const decimal = 10 ** 3;
  const result = await utils.set.rtp(Math.floor(rtp * decimal));
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

// Functions

/**
 * Call contract function rng and get result
 * @param {*} req
 * @param {*} res
 */
const rng = async (req, res) => {
  console.log(`================ RNG method called ====================`);
  const { address, block } = req.query;
  const hash = "0x" + (await getBlock(block)).blockID;

  const payload = await utils.func.rng(address, block, hash);
  if (!payload) return errorRes(res, 500, 73500);
  const model = models.rng(payload);

  console.log("Rng model is : ");
  console.debug(model);
  successRes(res, model);
};

const finishGame = async (req, res) => {
  const { index } = req.body;

  const game = await utils.get.game(index);
  if (!game) return errorRes(res, 500, 73500);
  const block = toDecimal(game.finishBlock);
  const hash = "0x" + (await getBlock(block)).blockID;

  const result = await utils.func.finishGame(index, hash);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

// Events

const takeBet = async (req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.takeBet();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.takeBet, from, to);

  successRes(res, { events });
};

const finishGameEvents = async (req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.finishGame();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.finishGame, from, to);

  successRes(res, { events });
};

const playersWin = async (req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.playersWin();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.playerWin, from, to);

  successRes(res, { events });
};

const setRTPEvents = async (req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.setRTP();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.setRTP, from, to);

  successRes(res, { events });
};

module.exports = {
  get: {
    game: getGame,
    games: getGames,
    params: getParams
  },
  set: {
    portal: setPortal,
    rtp: setRTP
  },
  func: {
    rng,
    finishGame
  },
  events: {
    takeBet,
    finishGame: finishGameEvents,
    playersWin,
    setRTP: setRTPEvents
  }
};
