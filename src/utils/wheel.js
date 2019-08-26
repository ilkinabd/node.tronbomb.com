const db = require('@db');
const { call, send, events } = require('@utils/tron');

const address = db.contracts.get({ type: 'wheel' });

module.exports = {
  get: {
    address: () => address,
    bet: call('bets', address),
    totalBets: call('totalBets', address),
    portal: call('portal', address),
    minBet: call('minBet', address),
    maxBet: call('maxBet', address),
    duration: call('gameDuration', address),
    startBlock: call('startBlock', address),
    processedBets: call('processedBets', address),
    owner: call('owner', address),
  },
  set: {
    duration: send('setGameDuration', address),
    portal: send('setPortal', address),
  },
  func: {
    rng: call('rng', address),
    finish: send('finish', address),
  },
  events: {
    takeBet: events('TakeBet', address),
    playerWin: events('PlayerWin', address),
  },
};
