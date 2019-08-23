const express = require('express');
const router = new express.Router();

const controller = require('@controllers/tools');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/get_contracts')
  .get(server, controller.getContracts);

// Getters

router.route('/get/block')
  .get(validate('id'), controller.get.block);

// Functions

router.route('/func/withdraw')
  .post(server, validate('walletToAmount', false), controller.func.withdraw);

module.exports = router;
