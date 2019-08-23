const express = require('express');
const router = new express.Router();

const controller = require('@controllers/tools');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/contracts')
  .get(server, controller.getContracts);

router.route('/block')
  .get(validate('index'), controller.block);

router.route('/withdraw')
  .post(server, validate('transfer', false), controller.withdraw);

module.exports = router;
