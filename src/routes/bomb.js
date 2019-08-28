const express = require('express');
const router = new express.Router();

const controller = require('@controllers/bomb');
const { server, admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/balanceOf')
  .get(server, validate('address'), controller.get.balanceOf);

router.route('/get/allowance')
  .get(server, validate('allowance'), controller.get.allowance);

router.route('/get/main_params')
  .get(server, controller.get.mainParams);

router.route('/get/roles_params')
  .get(server, controller.get.rolesParams);

// Setters

router.route('/set/sale_agent')
  .post(admin, validate('address', false), controller.set.setSaleAgent);

router.route('/set/stacking_hodler')
  .post(admin, validate('address', false), controller.set.setStackingHodler);

router.route('/set/transfer_ownership')
  .post(admin, validate('address', false), controller.set.transferOwnership);

router.route('/set/accept_ownership')
  .post(admin, controller.set.acceptOwnership);

// Functions

router.route('/func/transfer')
  .post(server, validate('transfer', false), controller.func.transfer);

router.route('/func/transfer_from')
  .post(server, validate('transferFrom', false), controller.func.transferFrom);

router.route('/func/approve')
  .post(server, validate('approve', false), controller.func.approve);

router.route('/func/increase_approval')
  .post(server, validate('approve', false), controller.func.increaseApproval);

router.route('/func/decrease_approval')
  .post(server, validate('approve', false), controller.func.decreaseApproval);

router.route('/func/freeze')
  .post(server, validate('amount', false), controller.func.freeze);

router.route('/func/unfreeze')
  .post(server, validate('amount', false), controller.func.unfreeze);

router.route('/func/mint')
  .post(server, validate('transfer', false), controller.func.mint);

router.route('/func/finish_minting')
  .post(admin, controller.func.finishMinting);

// Events

router.route('/events/transfer')
  .get(server, validate('events'), controller.events.transfer);

router.route('/events/burn')
  .get(server, validate('events'), controller.events.burn);

router.route('/events/approval')
  .get(server, validate('events'), controller.events.approval);

router.route('/events/freeze')
  .get(server, validate('events'), controller.events.freeze);

router.route('/events/unfreeze')
  .get(server, validate('events'), controller.events.unfreeze);

router.route('/events/mint')
  .get(server, validate('events'), controller.events.mint);

router.route('/events/new_sale_agent')
  .get(server, validate('events'), controller.events.newSaleAgent);

router.route('/events/ownership_transferred')
  .get(server, validate('events'), controller.events.ownershipTransferred);

module.exports = router;
