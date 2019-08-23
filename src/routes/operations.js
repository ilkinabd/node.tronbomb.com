const express = require('express');
const router = new express.Router();

const controller = require('@controllers/operations');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/params')
  .get(server, controller.get.params);

// Functions

router.route('/func/withdraw')
  .post(server, validate('transfer', false), controller.func.withdraw);

router.route('/func/withdraw_referral_profit')
  .post(server, validate('transfer', false), controller.func.referralProfit);

router.route('/func/withdraw_dividends')
  .post(server, validate('transfer', false), controller.func.dividends);

// Events

router.route('/events/withdraw')
  .get(server, validate('events'), controller.events.withdraw);

router.route('/events/withdraw_referral_profit')
  .get(server, validate('events'), controller.events.referralProfit);

router.route('/events/withdraw_dividends')
  .get(server, validate('events'), controller.events.dividends);

module.exports = router;
