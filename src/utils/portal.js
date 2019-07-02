const { PRIVATE_KEY, PORTAL_CONTRACT, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

let contract;

(async() => {
  contract = await tronWeb.contract().at(PORTAL_CONTRACT);
})();

const call = (variable) => async() => {
  if (!contract) return null;
  const result = await contract[variable]().call().catch(console.error);

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
  },
  events: {
    mainStatus: events('ChangeMainStatus'),
  },
  balance,
  withdraw: send('withdraw'),
};
