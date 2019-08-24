const utils = require('@utils/portal');
const bombUtils = require('@utils/bomb');
const models = require('@models/portal');
const { toSun, isAddress, isNullAddress } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

const filterEvents = (payload, model, from, to) => {
  const events = payload.filter(item => (
    (from || 0) <= item.timestamp && item.timestamp <= (to || Infinity)
  )).map(item => {
    item.data = model(item.result);

    delete item.result;
    delete item.contract;
    delete item.resourceNode;

    return item;
  });

  return events;
};

// Getters

const games = async(_req, res) => {
  const requests = [];
  for (let i = 0; i < 10; i++) requests.push(utils.get.game(i));

  const payload = await Promise.all(requests).catch(console.error);
  if (!payload) return errorRes(res, 500, 73500);

  const games = Array
    .from(payload, (address, index) => ({ address, index }))
    .filter(game => !isNullAddress(game.address));

  for (const i in games) {
    games[i].status = await utils.get.gameStatuses(games[i].address);
    games[i] = models.gameContract(games[i]);
  }

  successRes(res, { games });
};

const params = async(_req, res) => {
  const requests = [];
  const params = [
    'mainStatus', 'owner', 'address', 'BOMBHodler',
    'minTRXBet', 'maxTRXBet', 'minBOMBBet', 'maxBOMBBet'
  ];
  for (const param of params) requests.push(utils.get[param]());

  const results = await Promise.all(requests).catch(console.error);
  if (!results) return errorRes(res, 500, 73500);

  const payload = {};
  for (const i in params) payload[params[i]] = results[i];

  payload.balanceTRX = await utils.get.balance(results[2]);
  payload.balanceBOMB = (await bombUtils.get.balanceOf(results[3])).amount;

  const model = models.params(payload);

  successRes(res, model);
};

// Setters

const setMainStatus = async(req, res) => {
  const { status } = req.body;

  const result = await utils.set.mainStatus(status === 'true');
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const setBetParams = async(req, res) => {
  const { index } = req.body;
  const minBet = req.body.minBet * 10 ** 6;
  const maxBet = req.body.maxBet * 10 ** 6;

  const result = await utils.set.betParams(index, minBet, maxBet);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const setGame = async(req, res) => {
  const { index, address } = req.body;

  if (!isAddress(address)) return errorRes(res, 403, 73402);

  const result = await utils.set.game(index, address);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const setGameStatus = async(req, res) => {
  const { address, status } = req.body;

  if (!isAddress(address)) return errorRes(res, 403, 73402);

  const result = await utils.set.gameStatus(address, status === 'true');
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

const setBOMBHodler = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address)) return errorRes(res, 422, 73402);

  const result = await utils.set.bombHodler(address);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

// Functions

const takeBet = async(req, res) => {
  const { bet, gameId, data } = req.body;

  const result = await utils.func.takeBet(toSun(bet), gameId, data);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  const model = models.takeBet(result);

  successRes(res, model);
};

const takeBOMBBet = async(req, res) => {
  const { gameId, data } = req.body;
  const bet = req.body.bet * 10 ** 6;

  const result = await utils.func.takeBOMBBet(gameId, bet, data);
  if (result.error) return errorRes(res, 500, 73501, result.error);

  const model = models.takeBet(result);

  successRes(res, model);
};

const withdraw = async(req, res) => {
  const { amount } = req.body;

  const result = await utils.func.withdraw(toSun(amount));
  if (result.error) return errorRes(res, 500, 73501, result.error);

  successRes(res);
};

// Events

const payReward = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.payReward();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.payReward, from, to);

  successRes(res, { events });
};

const withdrawEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.withdraw();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.withdraw, from, to);

  successRes(res, { events });
};

const mainStatusEvents = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.mainStatus();
  if (!payload) return errorRes(res, 500, 73500);
  const events = filterEvents(payload, models.mainStatus, from, to);

  successRes(res, { events });
};

module.exports = {
  get: {
    games,
    params,
  },
  set: {
    mainStatus: setMainStatus,
    betParams: setBetParams,
    bombHodler: setBOMBHodler,
    game: setGame,
    gameStatus: setGameStatus,
  },
  func: {
    takeBet,
    takeBOMBBet,
    withdraw,
  },
  events: {
    payReward,
    withdraw: withdrawEvents,
    mainStatus: mainStatusEvents,
  },
};
