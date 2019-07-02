const { PRIVATE_KEY, PORTAL_CONTRACT, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

let contract;

(async() => {
  contract = await tronWeb.contract().at(PORTAL_CONTRACT);
})();

const call = (variable) => async(param) => {
  if (!contract) return null;
  const result = await
  (param ? contract[variable](param) : contract[variable]())
    .call().catch(console.error);

  return result;
};

const send = (method) => async(...params) => {
  if (!contract) return null;
  const result = await contract[method](...params).send({
    shouldPollResponse: true,
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
  control: {
    getMainStatus: call('mainStatus'),
    setMainStatus: send('setMainStatus'),
    getOwner: call('owner'),
    getToken: call('tokens'),
    setToken: send('setToken'),
    getGame: call('games'),
    setGame: send('setGame'),
    getGameStatus: call('gamesStatuses'),
    setGameStatus: send('setGameStatus'),
  },
  events: {
    mainStatus: events('ChangeMainStatus'),
    withdraws: events('Withdraw'),
    tokens: events('SetToken'),
    games: events('SetGame'),
    gamesStatuses: events('SetGameStatus'),
  },
  balance,
  withdraw: send('withdraw'),
};
