const express = require('express');
const router = new express.Router();

const controller = require('@controllers/tools');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/contracts')
  .get(server, controller.getContracts);

router.route('/funds')
  .get(server, controller.getFunds);

router.route('/portal_balance')
  .get(server, controller.portalBalance);

router.route('/total_mined')
  .get(server, controller.totalMined);

router.route('/block')
  .get(server, validate('index'), controller.block);

module.exports = router;
