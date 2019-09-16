const express = require('express');
const router = new express.Router();

const controller = require('@controllers/fund');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/balance')
  .get(server, validate('fund'), controller.getBalance);

router.route('/balances')
  .get(server, controller.getBalances);

router.route('/transfer')
  .post(server, validate('withdraw', false), controller.transferTRX);

router.route('/transfer_bomb')
  .post(server, validate('withdraw', false), controller.transferBOMB);

router.route('/mine')
  .post(server, validate('fund', false), controller.mine);

router.route('/freeze_all')
  .post(server, validate('fund', false), controller.freezeAll);

router.route('/withdraw_dividends')
  .post(server, validate('fund', false), controller.withdrawDividends);

module.exports = router;
