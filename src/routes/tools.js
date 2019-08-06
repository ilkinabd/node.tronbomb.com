const express = require('express');
const router = new express.Router();

const controller = require('@controllers/tools');
const validate = require('@middleware/validate');

// Functions

router.route('/func/request')
  .post(validate('code', false), controller.func.request);

router.route('/func/withdraw')
  .post(validate('walletWalletAmount', false), controller.func.withdraw);

// Events

router.route('/events/withdraw')
  .get(validate('fromTo'), controller.events.withdraw);

module.exports = router;
