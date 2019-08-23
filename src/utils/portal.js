const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');
const { call, send, payable, events, balance } = require('@utils/tron');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const address = db.contracts.get({ type: 'portal' });
const contract = async() => tronWeb.contract().at(await address);

module.exports = {
  get: {
    address: () => address,
    balance: async() => balance(await address),
    mainStatus: call('mainStatus', contract),
    owner: call('owner', contract),
    game: call('games', contract),
    gameStatuses: call('gameStatuses', contract),
    BOMBHodler: call('BOMBHodler', contract),
    minTRXBet: call('minTRXBet', contract),
    maxTRXBet: call('maxTRXBet', contract),
    minBOMBBet: call('minBOMBBet', contract),
    maxBOMBBet: call('maxBOMBBet', contract),
  },
  set: {
    mainStatus: send('setMainStatus', contract),
    betParams: send('setBetParams', contract),
    game: send('setGame', contract),
    gameStatus: send('setGameStatus', contract),
  },
  func: {
    takeBet: payable('takeBet', contract),
    takeBOMBBet: send('takeBOMBBet', contract),
    withdraw: send('withdraw', contract),
  },
  events: {
    payReward: events('PayReward', address),
    withdraw: events('Withdraw', address),
    mainStatus: events('SetMainStatus', address),
    token: events('SetToken', address),
    game: events('SetGame', address),
    gamesStatus: events('SetGameStatus', address),
  },
};
