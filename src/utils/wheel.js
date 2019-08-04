const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');
const { call, send, events } = require('@utils/tron');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const address = db.contracts.get({ type: 'wheel' });
const contract = async() => tronWeb.contract().at(await address);

module.exports = {
  get: {
    game: call('games', contract),
    totalGames: call('totalGames', contract),
    gameBet: call('getGameBet', contract),
    portal: call('portal', contract),
    minBet: call('minBet', contract),
    maxBet: call('maxBet', contract),
    duration: call('gameDuration', contract),
    rng: call('wheelRNG', contract),
  },
  set: {
    portal: send('setPortalAddress', contract),
    bet: send('setMinMaxBet', contract),
    duration: send('setGameDuration', contract),
  },
  func: {
    init: send('initGame', contract),
    finish: send('finishGame', contract),
  },
  events: {
    initGame: events('InitGame', address),
    takeBet: events('TakeBet', address),
    finishGame: events('FinishGame', address),
    playerWin: events('PlayerWin', address),
    changeMinMaxBet: events('ChangeMinMaxBet', address),
    changeDuration: events('ChangeGameDuration', address),
  },
};
