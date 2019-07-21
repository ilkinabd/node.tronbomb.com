const portal = require('@utils/portal');
const dice = require('@utils/dice');
const { toBase58, toTRX, toSun } = require('@utils/tron');
const { success: resSuccess, error: resError } = require('@utils/res-builder');

const toGameModel = (game) => {
  const amount = parseFloat(game.amount, 16);

  game.gameId = parseFloat(game.gameId, 16);
  game.finishBlock = parseFloat(game.finishBlock, 16);
  game.amount = (game.tokenId === 0) ? toTRX(amount) : amount;
  game.result = (game.status === 0) ? null : game.result;
  game.status = (game.status === 0) ? 'start' : 'finish';
  game.player = toBase58(game.player);
};

const filterEvents = (events, from, to) => (events.filter((event) => (
  (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
)));

// Getters

const getGame = async(req, res) => {
  const { contractId, gameId } = req.query;

  const contractAddress = await portal.get.game(contractId);
  const game = await dice.get.game(contractAddress, gameId);
  if (game === undefined) return res.status(500).json(resError(73500));
  toGameModel(game);

  res.json(resSuccess({ game }));
};

const getGames = async(req, res) => {
  const { contractId } = req.query;

  const contractAddress = await portal.get.game(contractId);
  const totalGames = await dice.get.totalGames(contractAddress);

  const requests = [];

  for (let gameId = 0; gameId < totalGames; gameId++) {
    const game = dice.get.game(contractAddress, gameId);
    requests.push(game);
  }

  const games = await Promise.all(requests).catch((error) => {
    console.error(error);
    return res.status(500).json(resError(73500));
  });

  for (const game of games) toGameModel(game);

  res.json(resSuccess({ games }));
};

const getParams = async(req, res) => {
  const { contractId } = req.query;

  const contractAddress = await portal.get.game(contractId);

  const portalAddress = await dice.get.portal(contractAddress);
  const rtp = await dice.get.rtp(contractAddress);
  const rtpDivider = await dice.get.rtpDivider(contractAddress);
  const minBet = await dice.get.minBet(contractAddress);
  const maxBet = await dice.get.maxBet(contractAddress);

  res.json(resSuccess({
    portal: toBase58(portalAddress),
    rtp: rtp / rtpDivider,
    minBet: toTRX(parseFloat(minBet, 16)),
    maxBet: toTRX(parseFloat(maxBet, 16)),
  }));
};

// Setters

const setPortal = async(req, res) => {
  const { contractId, address } = req.body;

  const contractAddress = await portal.get.game(contractId);

  const result = await dice.set.portal(contractAddress, address);
  if (result === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setRTP = async(req, res) => {
  const { contractId, rtp } = req.body;

  const contractAddress = await portal.get.game(contractId);

  const result = await dice.set.rtp(contractAddress, rtp * 10000, 10000);
  if (result === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

const setBet = async(req, res) => {
  const { contractId, min, max } = req.body;

  const contractAddress = await portal.get.game(contractId);

  const result = await dice.set.bet(contractAddress, toSun(min), toSun(max));
  if (result === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

// Functions

const finishGame = async(req, res) => {
  const { contractId, gameId } = req.body;

  const contractAddress = await portal.get.game(contractId);

  const result = await dice.controll.finishGame(contractAddress, gameId);
  if (result === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ result }));
};

// Events

const takeBets = async(req, res) => {
  const { contractId, from, to } = req.query;

  const contractAddress = await portal.get.game(contractId);

  let events = await dice.events.takeBets(contractAddress);
  if (events === undefined) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    const { amount, tokenId, player } = event.result;
    if (tokenId === '0') event.result.amount = toTRX(amount);
    event.result.player = toBase58(player);
  }

  res.json(resSuccess({ events }));
};

const finishGames = async(req, res) => {
  const { contractId, from, to } = req.query;

  const contractAddress = await portal.get.game(contractId);

  let events = await dice.events.finishGames(contractAddress);
  if (events === undefined) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  res.json(resSuccess({ events }));
};

const playersWin = async(req, res) => {
  const { contractId, from, to } = req.query;

  const contractAddress = await portal.get.game(contractId);

  let events = await dice.events.playersWin(contractAddress);
  if (events === undefined) return res.status(500).json(resError(73500));

  events = filterEvents(events, from, to);
  for (const event of events) {
    const { amount, tokenId, player } = event.result;
    if (tokenId === '0') event.result.amount = toTRX(amount);
    event.result.player = toBase58(player);
  }

  res.json(resSuccess({ events }));
};

const changeParams = async(req, res) => {
  const { contractId, from, to } = req.query;

  const contractAddress = await portal.get.game(contractId);

  const rtp = await dice.events.changeRTP(contractAddress);
  if (rtp === undefined) return res.status(500).json(resError(73500));
  const bet = await dice.events.changeMinMaxBet(contractAddress);
  if (bet === undefined) return res.status(500).json(resError(73500));

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
