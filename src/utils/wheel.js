const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');
const { call, send, events } = require('@utils/tron');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const address = db.contracts.get({ type: 'wheel' });
const contract = async() => tronWeb.contract().at(await address);

module.exports = {
  get: {
    address: () => address,
    bet: call('bets', contract),
    totalBets: call('totalBets', contract),
    portal: call('portal', contract),
    minBet: call('minBet', contract),
    maxBet: call('maxBet', contract),
    duration: call('gameDuration', contract),
    startBlock: call('startBlock', contract),
    processedBets: call('processedBets', contract),
    rng: call('wheelRNG', contract),
    owner: call('owner', contract),
  },
  set: {
    portal: send('setPortalAddress', contract),
    bet: send('setMinMaxBet', contract),
    duration: send('setGameDuration', contract),
  },
  func: {
    finish: send('finish', contract),
  },
  events: {
    takeBet: events('TakeBet', address),
    playerWin: events('PlayerWin', address),
    changeMinMaxBet: events('ChangeMinMaxBet', address),
    changeDuration: events('ChangeGameDuration', address),
  },
};
