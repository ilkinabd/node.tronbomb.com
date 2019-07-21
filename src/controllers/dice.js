const utils = require('@utils/dice');
const {
  toBase58, toDecimal, toTRX, toSun, isAddress, isNullAddress
} = require('@utils/tron');
const { resSuccess, resError } = require('@utils/res-builder');

const toGameModel = (game) => {
  game.gameId = toDecimal(game.gameId);
  game.finishBlock = toDecimal(game.finishBlock);
  game.amount =
    (game.tokenId === 0) ? toTRX(game.amount) : toDecimal(game.amount);
  game.result = (game.status === 0) ? null : game.result;
  game.status = (game.status === 0) ? 'start' : 'finish';
  game.player = toBase58(game.player);
};

const filterEvents = (events, from, to) => (events.filter((event) => (
  (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
)));

// Getters

const getGame = async(req, res) => {
  const { gameId } = req.query;

  const game = await utils.get.game(gameId);
  if (game === undefined) return res.status(500).json(resError(73500));
  toGameModel(game);

  res.json(resSuccess({ game }));
};

const getGames = async(_req, res) => {
  const totalGames = toDecimal(await utils.get.totalGames());

  const requests = [];
  for (let gameId = 0; gameId < totalGames; gameId++) {
    requests.push(utils.get.game(gameId.toString()));
  }

  const games = await Promise.all(requests).catch((error) => {
    console.error(error);
    return res.status(500).json(resError(73500));
  });
  for (const game of games) toGameModel(game);

  res.json(resSuccess({ games }));
};

const getParams = async(_req, res) => {
  const portal = toBase58(await utils.get.portal());
  const rtp = await utils.get.rtp();
  const rtpDivider = await utils.get.rtpDivider();
  const minBet = toTRX(await utils.get.minBet());
  const maxBet = toTRX(await utils.get.maxBet());

  res.json(resSuccess({ portal, rtp: rtp / rtpDivider, minBet, maxBet }));
};

// Setters

const setPortal = async(req, res) => {
  const { address } = req.body;

  if (!isAddress(address) || isNullAddress(address))
    return res.status(422).json(resError(73402));

  const result = await utils.set.portal(address);
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setRTP = async(req, res) => {
  const { rtp } = req.body;

  const rtpDivider = 10000;
  const result = await utils.set.rtp(rtp * rtpDivider, rtpDivider);
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setBet = async(req, res) => {
  const { min, max } = req.body;

  const result = await utils.set.bet(toSun(min), toSun(max));
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

// Functions

const finishGame = async(req, res) => {
  const { gameId } = req.body;

  const result = await utils.func.finishGame(gameId);
  if (!result) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

// Events

const takeBets = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.takeBets();
  if (!events) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    const { amount, tokenId, player } = event.result;
    if (tokenId === '0') event.result.amount = toTRX(amount);
    event.result.gameId = parseInt(event.result.gameId);
    event.result.number = parseInt(event.result.number);
    event.result.finishBlock = parseInt(event.result.finishBlock);
    event.result.tokenId = parseInt(event.result.tokenId);
    event.result.roll = parseInt(event.result.roll);
    event.result.player = toBase58(player);
  }

  res.json(resSuccess({ events }));
};

const finishGames = async(req, res) => {
  const { from, to } = req.query;

  let events = await utils.events.finishGames();
  if (!events) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    event.result.gameId = parseInt(event.result.gameId);
    event.result.result = parseInt(event.result.result);
  }

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
