const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const getAddress = () => db.contracts.get({ type: 'wheel' });
const getContract = async() => tronWeb.contract().at(await getAddress());

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

const events = (eventName) => async() => {
  const events = await tronWeb.getEventResult(await getAddress(), {
    eventName,
  }).catch(console.error);

  return events;
};

module.exports = {
  get: {
    portal: call('portal'),
    minBet: call('minBet'),
    maxBet: call('maxBet'),
  },
  set: {
    portal: send('setPortalAddress'),
    bet: send('setMinMaxBet'),
  },
  events: {
    changeMinMaxBet: events('ChangeMinMaxBet'),
  },
};
