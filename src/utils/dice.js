const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');
const { call, send, events } = require('@utils/tron');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const address = db.contracts.get({ type: 'dice' });
const contract = async() => tronWeb.contract().at(await address);

module.exports = {
  get: {
    address: () => address,
    game: call('games', contract),
    totalGames: call('totalGames', contract),
    portal: call('portal', contract),
    rtp: call('rtp', contract),
    owner: call('owner', contract),
  },
  set: {
    portal: send('setPortal', contract),
    rtp: send('setRTP', contract),
  },
  func: {
    rng: call('rng', contract),
    finishGame: send('finishGame', contract),
  },
  events: {
    takeBet: events('TakeBet', address),
    finishGame: events('FinishGame', address),
    playersWin: events('PlayerWin', address),
    setRTP: events('SetRTP', address),
  },
};
