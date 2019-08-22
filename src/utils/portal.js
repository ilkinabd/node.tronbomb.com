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
    token: call('tokens', contract),
    game: call('games', contract),
    gameStatuses: call('gameStatuses', contract),
  },
  set: {
    mainStatus: send('setMainStatus', contract),
    token: send('setToken', contract),
    game: send('setGame', contract),
    gameStatus: send('setGameStatus', contract),
  },
  func: {
    takeBet: payable('takeBet', contract),
    withdraw: send('withdraw', contract),
  },
  events: {
    mainStatus: events('ChangeMainStatus', address),
    withdraw: events('Withdraw', address),
    token: events('SetToken', address),
    game: events('SetGame', address),
    gamesStatus: events('SetGameStatus', address),
    reward: events('PayReward', address),
  },
};
