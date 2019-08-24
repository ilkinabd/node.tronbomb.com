const express = require('express');
const router = new express.Router();

const controller = require('@controllers/tools');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/contracts')
  .get(server, controller.getContracts);

router.route('/block')
  .get(server, validate('index'), controller.block);

router.route('/fund_balance')
  .get(server, validate('fund'), controller.fundBalance);

router.route('/fund_balances')
  .get(server, controller.fundBalances);

router.route('/withdraw')
  .post(server, validate('withdraw', false), controller.withdraw);

module.exports = router;
