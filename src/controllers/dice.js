const portal = require('@utils/portal');
const dice = require('@utils/dice');
const { success: resSuccess, error: resError } = require('@utils/res-builder');

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

// Setters

// Events

module.exports = {
  get: {
    game: getGame,
    games: getGames,
  },
  set: {

  },
  control: {

  },
  events: {

  },
};
