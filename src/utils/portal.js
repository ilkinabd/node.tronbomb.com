const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');
const { call, send, payable, events, getBalance } = require('@utils/tron');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const address = db.contracts.get({ type: 'portal' });
const contract = async() => tronWeb.contract().at(await address);

const balance = async() => getBalance(await address);

module.exports = {
  get: {
    balance,
    mainStatus: call('mainStatus', contract),
    owner: call('owner', contract),
    token: call('tokens', contract),
    game: call('games', contract),
    gameStatus: call('gamesStatuses', contract),
  },
  set: {
    mainStatus: send('setMainStatus', contract),
    token: send('setToken', contract),
    game: send('setGame', contract),
    gameStatus: send('setGameStatus', contract),
  },
  func: {
    takeTRXBet: payable('takeTRXBet', contract),
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
