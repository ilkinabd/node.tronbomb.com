const { PRIVATE_KEY, PORTAL_CONTRACT, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

let contract;

(async() => {
  contract = await tronWeb.contract().at(PORTAL_CONTRACT);
})();

const call = (variable) => async(param) => {
  if (!contract) return;
  const result = await
  (param ? contract[variable](param) : contract[variable]())
    .call().catch(console.error);

  return result;
};

const send = (method) => async(...params) => {
  if (!contract) return;
  const result = await contract[method](...params).send({
    shouldPollResponse: true,
  }).catch(console.error);

  return result;
};

const payable = (method) => async(amount, ...params) => {
  if (!contract) return;

  const result = await contract[method](...params).send({
    shouldPollResponse: true,
    callValue: amount,
  }).catch(console.error);

  return result;
};

const events = (eventName) => async() => {
  const events = await tronWeb.getEventResult(PORTAL_CONTRACT, {
    eventName,
  }).catch(console.error);

  return events;
};

const balance = () => tronWeb.trx.getBalance(PORTAL_CONTRACT);

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
