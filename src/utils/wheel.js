const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const getAddress = () => db.contracts.get({ type: 'wheel' });
const getContract = async() => tronWeb.contract().at(await getAddress());

const call = (variable) => async(...params) => {
  const contract = await getContract();
  const result = await contract[variable](...params).call()
    .catch(console.error);

  return result;
};

const send = (method) => async(...params) => {
  const contract = await getContract();
  const result = await contract[method](...params).send({
    shouldPollResponse: true,
  }).catch(console.error);

  return result;
};

const events = (eventName) => async() => {
  const events = await tronWeb.getEventResult(await getAddress(), {
    eventName,
  }).catch(console.error);

  return events;
};

module.exports = {
  get: {
    game: call('games'),
    totalGames: call('totalGames'),
    gameBet: call('getGameBet'),
    portal: call('portal'),
    minBet: call('minBet'),
    maxBet: call('maxBet'),
    duration: call('gameDuration'),
  },
  set: {
    portal: send('setPortalAddress'),
    bet: send('setMinMaxBet'),
    duration: send('setGameDuration'),
  },
  func: {
    init: send('initGame'),
    finish: send('finishGame'),
  },
  events: {
    initGame: events('InitGame'),
    takeBet: events('TakeBet'),
    changeMinMaxBet: events('ChangeMinMaxBet'),
    changeDuration: events('ChangeGameDuration'),
  },
};
