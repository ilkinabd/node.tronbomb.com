const db = require('@db');
const { call, send, events } = require('@utils/tron');

const address = db.contracts.get({ type: 'portal' });

module.exports = {
  get: {
    balanceOf: call('balanceOf', address),
    allowance: call('allowance', address),
    name: call('NAME', address),
    symbol: call('SYMBOL', address),
    decimal: call('DECIMAL', address),
    totalSupply: call('totalSupply', address),
    mintingFinished: call('mintingFinished', address),
    totalBurned: call('totalBurned', address),
    owner: call('owner', address),
    saleAgent: call('saleAgent', address),
    newOwner: call('newOwner', address),
    stakingHodler: call('stakingHodler', address),
  },
  set: {
    setSaleAgent: send('setSaleAgent', address),
    setStackingHodler: send('setStackingHodler', address),
    transferOwnership: send('transferOwnership', address),
    acceptOwnership: send('acceptOwnership', address),
  },
  func: {
    transfer: send('transfer', address),
    transferFrom: send('transferFrom', address),
    approve: send('approve', address),
    increaseApproval: send('increaseApproval', address),
    decreaseApproval: send('decreaseApproval', address),
    freeze: send('freeze', address),
    freezeAgain: send('freezeAgain', address),
    mint: send('mint', address),
    finishMinting: send('finishMinting', address),
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
