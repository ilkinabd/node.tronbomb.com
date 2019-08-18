const express = require('express');
const router = new express.Router();

const controller = require('@controllers/bomb');
const { server } = require('@middleware/auth');
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

// Functions

// Events

module.exports = router;
