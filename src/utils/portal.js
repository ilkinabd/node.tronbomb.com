const db = require('@db');
const { call, send, payable, events, balance } = require('@utils/tron');

const address = db.contracts.get({ type: 'portal' });

module.exports = {
  get: {
    address: () => address,
    balance: async() => balance(await address),
    mainStatus: call('mainStatus', address),
    owner: call('owner', address),
    game: call('games', address),
    gameStatuses: call('gameStatuses', address),
    BOMBHodler: call('BOMBHodler', address),
    minTRXBet: call('minTRXBet', address),
    maxTRXBet: call('maxTRXBet', address),
    minBOMBBet: call('minBOMBBet', address),
    maxBOMBBet: call('maxBOMBBet', address),
  },
  set: {
    mainStatus: send('setMainStatus', address),
    betParams: send('setBetParams', address),
    bombHodler: send('setBOMBHodler', address),
    game: send('setGame', address),
    gameStatus: send('setGameStatus', address),
  },
  func: {
    takeBet: payable('takeBet', address),
    takeBOMBBet: send('takeBOMBBet', address),
    withdraw: send('withdraw', address),
  },
  events: {
    payReward: events('PayReward', address),
    withdraw: events('Withdraw', address),
    mainStatus: events('SetMainStatus', address),
  },
};
