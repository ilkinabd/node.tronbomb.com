const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const db = require('@db');
const { call, send, events } = require('@utils/tron');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const address = db.contracts.get({ type: 'token' });
const contract = async() => tronWeb.contract().at(await address);

module.exports = {
  get: {
    balanceOf: call('balanceOf', contract),
    allowance: call('allowance', contract),
    name: call('NAME', contract),
    symbol: call('SYMBOL', contract),
    decimal: call('DECIMAL', contract),
    totalSupply: call('totalSupply', contract),
    mintingFinished: call('mintingFinished', contract),
    totalBurned: call('totalBurned', contract),
    owner: call('owner', contract),
    saleAgent: call('saleAgent', contract),
    newOwner: call('newOwner', contract),
    minStackingPeriod: call('minStackingPeriod', contract),
    minStackingAmount: call('minStackingAmount', contract),
    stakingHodler: call('stakingHodler', contract),
  },
  set: {
    setSaleAgent: send('setSaleAgent', contract),
    setStackingHodler: send('setStackingHodler', contract),
    setStackingParams: send('setStackingParams', contract),
    transferOwnership: send('transferOwnership', contract),
    acceptOwnership: send('acceptOwnership', contract),
  },
  func: {
    transfer: send('transfer', contract),
    transferFrom: send('transferFrom', contract),
    approve: send('approve', contract),
    increaseApproval: send('increaseApproval', contract),
    decreaseApproval: send('decreaseApproval', contract),
    freeze: send('freeze', contract),
    freezeAgain: send('freezeAgain', contract),
    mint: send('mint', contract),
    finishMinting: send('finishMinting', contract),
  },
  events: {
    transfer: events('Transfer', address),
    burn: events('Burn', address),
    approval: events('Approval', address),
    freeze: events('Freeze', address),
    freezeAgain: events('FreezeAgain', address),
    mint: events('Mint', address),
    newSaleAgent: events('NewSaleAgent', address),
    ownershipTransferred: events('OwnershipTransferred', address),
  },
};
