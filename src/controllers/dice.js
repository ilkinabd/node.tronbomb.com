const portal = require('@utils/portal');
const dice = require('@utils/dice');
const { success: resSuccess, error: resError } = require('@utils/res-builder');

const toSun = amount => (amount * 10 ** 6);

// const filterEvents = (events, from, to) => (events.filter((event) => (
//   (from || 0) <= event.timestamp && event.timestamp <= (to || Infinity)
// )));

// Getters

const getGame = async(req, res) => {
  const { contractId, gameId } = req.query;

  const contractAddress = await portal.get.game(contractId);
  const game = await dice.get.game(contractAddress, gameId);
  if (game === undefined) return res.status(500).json(resError(73500));
  res.json(resSuccess({ game }));
};

const getGames = async(req, res) => {
  const { contractId } = req.query;

  const contractAddress = await portal.get.game(contractId);
  const totalGames = await dice.get.totalGames(contractAddress);

  const requests = [];

  for (let gameId = 0; gameId < totalGames; gameId++) {
    console.log(gameId);
    const game = dice.get.game(contractAddress, gameId);
    requests.push(game);
  }

  const games = await Promise.all(requests).catch((error) => {
    console.error(error);
    return res.status(500).json(resError(73500));
  });

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
    portal: portalAddress,
    rtp: rtp / rtpDivider,
    minBet: parseFloat(minBet, 16),
    maxBet: parseFloat(maxBet, 16),
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

// Events

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
  control: {

  },
  events: {

  },
};
