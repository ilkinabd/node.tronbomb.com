const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const auth = require('@middleware/check-auth');
const validate = require('@middleware/validate-params');

router.route('/get/main_status')
  .get(auth, controller.getMainStatus);

router.route('/set/main_status')
  .post(auth, validate('setMainStatus', false), controller.setMainStatus);

router.route('/get/owner')
  .get(auth, controller.getOwner);

router.route('/get/token')
  .get(auth, validate('getToken', true), controller.getToken);

router.route('/set/token')
  .post(auth, validate('setToken', false), controller.setToken);

router.route('/balance')
  .get(auth, controller.balance);

router.route('/withdraw')
  .post(auth, validate('withdraw', false), controller.withdraw);

router.route('/events/main_status')
  .get(auth, validate('statusEvents', true), controller.events.mainStatus);

router.route('/events/withdraws')
  .get(auth, controller.events.withdraws);

module.exports = router;
