const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const getAddress = () => db.contracts.get({ type: 'dice' });
const getContract = async() => tronWeb.contract().at(await getAddress());

const call = (variable) => async(...params) => {
  const contract = await getContract();
  const result = await contract[variable](...params)
    .call().catch(console.error);

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
    portal: call('portal'),
    rtp: call('rtp'),
    rtpDivider: call('rtpDivider'),
    minBet: call('minBet'),
    maxBet: call('maxBet'),
    rng: call('diceRNG'),
  },
  set: {
    portal: send('setPortalAddress'),
    rtp: send('setRTP'),
    bet: send('setMinMaxBet'),
  },
  func: {
    finishGame: send('finishGame'),
  },
  events: {
    takeBets: events('TakeBet'),
    finishGames: events('FinishGame'),
    playersWin: events('PlayerWin'),
    changeRTP: events('ChangeRTP'),
    changeMinMaxBet: events('ChangeMinMaxBet'),
  },
};
