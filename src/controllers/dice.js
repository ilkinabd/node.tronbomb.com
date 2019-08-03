const utils = require('@utils/dice');
const models = require('@models/dice');
const { toBase58, toDecimal, toTRX, toSun, isAddress } = require('@utils/tron');
const { resSuccess, resError } = require('@utils/res-builder');

const filterEvents = (payload, model, from, to) => {
  const events = payload.filter(item => (
    (from || 0) <= item.timestamp && item.timestamp <= (to || Infinity)
  )).map(item => {
    item.result = model(item.result);
    return item;
  });

  return events;
};

// Getters

const getGame = async(req, res) => {
  const { gameId } = req.query;

  const payload = await utils.get.game(gameId);
  if (!payload) return res.status(500).json(resError(73500));
  const game = models.game(payload);

  res.json(resSuccess({ game }));
};

const getGames = async(req, res) => {
  const { from, to } = req.query;

  const totalGames = toDecimal(await utils.get.totalGames());
  if (!totalGames) return res.status(500).json(resError(73500));

  const first = from || 0;
  const last = Math.min(totalGames, to || totalGames);

  const requests = [];
  for (let id = first; id < last; id++) requests.push(utils.get.game(id));
  const payload = await Promise.all(requests).catch(console.error);

  const games = Array.from(payload, item => models.game(item));

  res.json(resSuccess({ games }));
};

const getParams = async(_req, res) => {
  const portal = await utils.get.portal();
  const rtp = await utils.get.rtp();
  const rtpDivider = await utils.get.rtpDivider();
  const minBet = await utils.get.minBet();
  const maxBet = await utils.get.maxBet();

  const params = models.params({ portal, rtp, rtpDivider, minBet, maxBet });

  res.json(resSuccess({ params }));
};

const getRNG = async(req, res) => {
  const { wallet, blockNumber, blockHash } = req.query;

  const payload = await utils.get.rng(wallet, blockNumber, blockHash);
  if (!payload) return res.status(500).json(resError(73500));

  const random = payload.result;

  res.json(resSuccess({ random }));
};

// Setters

const setPortal = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address)) return res.status(422).json(resError(73402));
  const result = await utils.set.portal(address);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

const setRTP = async(req, res) => {
  const { rtp } = req.body;

  const divider = 10000;
  const result = await utils.set.rtp(Math.floor(rtp * divider), divider);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

const setBet = async(req, res) => {
  const { min, max } = req.body;

  const result = await utils.set.bet(toSun(min), toSun(max));
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

// Functions

const finishGame = async(req, res) => {
  const { gameId } = req.body;

  const result = await utils.func.finishGame(gameId);
  if (!result) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

// Events

const takeBets = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.takeBets();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.takeBets, from, to);

  res.json(resSuccess({ events }));
};

const finishGames = async(req, res) => {
  const { from, to } = req.query;

  const payload = await utils.events.finishGames();
  if (!payload) return res.status(500).json(resError(73500));

  const events = filterEvents(payload, models.finishGame, from, to);

  res.json(resSuccess({ events }));
};

const playersWin = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.playersWin();
  if (events === undefined) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    const { amount, tokenId, player } = event.result;
    if (tokenId === '0') event.result.amount = toTRX(amount);
    event.result.gameId = parseInt(event.result.gameId);
    event.result.tokenId = parseInt(event.result.tokenId);
    event.result.player = toBase58(player);
  }

  res.json(resSuccess({ events }));
};

const changeParams = async(req, res) => {
  const { from, to } = req.query;

  const rtp = await utils.events.changeRTP();
  if (!rtp) return res.status(500).json(resError(73500));
  const bet = await utils.events.changeMinMaxBet();
  if (!bet) return res.status(500).json(resError(73500));

  for (const event of rtp) {
    event.result.rtp /= event.result.rtpDivider;
    delete event.result.rtpDivider;
  }
  for (const event of bet) {
    event.result.minBet = toTRX(event.result.minBet);
    event.result.maxBet = toTRX(event.result.maxBet);
  }

  const events = filterEvents(rtp.concat(bet), from, to);
  res.json(resSuccess({ events }));
};

module.exports = {
  get: {
    game: getGame,
    games: getGames,
    params: getParams,
    rng: getRNG,
  },
  set: {
    portal: setPortal,
    rtp: setRTP,
    bet: setBet,
  },
  func: {
    finishGame,
  },
  events: {
    takeBets,
    finishGames,
    playersWin,
    changeParams,
  },
};
