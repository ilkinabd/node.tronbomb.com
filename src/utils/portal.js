const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const getPortalAddress = () => db.contracts.get({ type: 'portal' });
const getContract = async() => tronWeb.contract().at(await getPortalAddress());

const call = (variable) => async(param) => {
  const contract = await getContract();
  const result = await
  (param ? contract[variable](param) : contract[variable]())
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

const payable = (method) => async(amount, ...params) => {
  const contract = await getContract();

  const result = await contract[method](...params).send({
    shouldPollResponse: true,
    callValue: amount,
  }).catch(console.error);

  return result;
};

const events = (eventName) => async() => {
  const events = await tronWeb.getEventResult(await getPortalAddress(), {
    eventName,
  }).catch(console.error);

  return events;
};

const balance = async() => tronWeb.trx.getBalance(await getPortalAddress());

module.exports = {
  balance,
  withdraw: send('withdraw'),
  get: {
    mainStatus: call('mainStatus'),
    owner: call('owner'),
    token: call('tokens'),
    game: call('games'),
    gameStatus: call('gamesStatuses'),
  },
  set: {
    mainStatus: send('setMainStatus'),
    token: send('setToken'),
    game: send('setGame'),
    gameStatus: send('setGameStatus'),
  },
  payable: {
    takeTRXBet: payable('takeTRXBet'),
  },
  events: {
    mainStatus: events('ChangeMainStatus'),
    withdraws: events('Withdraw'),
    tokens: events('SetToken'),
    games: events('SetGame'),
    gamesStatuses: events('SetGameStatus'),
    rewards: events('PayReward'),
  },
};
