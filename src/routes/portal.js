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

router.route('/events/main_status')
  .get(auth, validate('statusEvents', true), controller.getMainStatusEvents);

module.exports = router;
