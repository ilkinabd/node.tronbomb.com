const db = require('@db');
const { call, send, events } = require('@utils/tron');

const address = db.contracts.get({ type: 'portal' });
const tokenAddress = db.contracts.get({ type: 'token' });

module.exports = {
  get: {
    balanceOf: call('balanceOf', tokenAddress),
    allowance: call('allowance', address),
    name: call('NAME', address),
    symbol: call('SYMBOL', address),
    decimal: call('DECIMAL', address),
    totalSupply: call('totalSupply', tokenAddress),
    mintingFinished: call('mintingFinished', address),
    totalBurned: call('totalBurned', address),
    owner: call('owner', address),
    saleAgent: call('saleAgent', address),
    newOwner: call('newOwner', address),
    // stakingHodler: call('stakingHodler', address), // didn't find declaration
  },
  set: {
    setSaleAgent: send('setSaleAgent', address),
    // setStackingHodler: send('setStackingHodler', address), // didn't find declaration
    transferOwnership: send('transferOwnership', address),
    acceptOwnership: send('acceptOwnership', address),
    transferOwnershipToken: send('transferOwnership', tokenAddress),
    acceptOwnershipToken: send('acceptOwnership', tokenAddress),
  },
  func: {
    transfer: send('transfer', tokenAddress),
    transferFrom: send('transferFrom', tokenAddress),
    approve: send('approve', tokenAddress),
    increaseApproval: send('increaseApproval', tokenAddress),
    decreaseApproval: send('decreaseApproval', tokenAddress),
    freeze: send('freeze', tokenAddress),
    unfreezeAll: send('unfreezeAll', tokenAddress),
    mint: send('mint', tokenAddress),
    finishMinting: send('finishMinting', tokenAddress),
  },
  events: {
    transfer: events('Transfer', tokenAddress),
    burn: events('Burn', tokenAddress),
    approval: events('Approval', tokenAddress),
    freeze: events('Freeze', tokenAddress),
    unfreezeAll: events('UnfreezeAll', tokenAddress),
    mint: events('Mint', tokenAddress),
    newSaleAgent: events('NewSaleAgent', address),
    ownershipTransferred: events('OwnershipTransferred', address),
    ownershipTransferredToken: events('OwnershipTransferred', tokenAddress),
  },
};
