const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const auth = require('@middleware/check-auth');

router.route('/main_status/get')
  .get(auth, controller.getMainStatus);

module.exports = router;
