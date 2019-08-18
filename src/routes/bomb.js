const express = require('express');
const router = new express.Router();

const controller = require('@controllers/bomb');
const { server, admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/balanceOf')
  .get(server, validate('address'), controller.get.balanceOf);

router.route('/get/allowance')
  .get(server, validate('addressSpender'), controller.get.allowance);

router.route('/get/main_params')
  .get(server, controller.get.mainParams);

router.route('/get/roles_params')
  .get(server, controller.get.rolesParams);

router.route('/get/stacking_params')
  .get(server, controller.get.stackingParams);

// Setters

router.route('/set/sale_agent')
  .post(admin, validate('address', false), controller.set.setSaleAgent);

router.route('/set/stacking_hodler')
  .post(admin, validate('address', false), controller.set.setStackingHodler);

router.route('/set/stacking_params').post(
  admin, validate('stackingParams', false),
  controller.set.setStackingParams
);

// Functions

router.route('/func/transfer')
  .post(server, validate('transfer', false), controller.func.transfer);

router.route('/func/approve')
  .post(server, validate('approve', false), controller.func.approve);

router.route('/func/increase_approval')
  .post(server, validate('approve', false), controller.func.increaseApproval);

router.route('/func/decrease_approval')
  .post(server, validate('approve', false), controller.func.decreaseApproval);

// Events

module.exports = router;
