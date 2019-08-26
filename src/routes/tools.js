const express = require('express');
const router = new express.Router();

const controller = require('@controllers/tools');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/contracts')
  .get(server, controller.getContracts);

router.route('/block')
  .get(server, validate('index'), controller.block);

module.exports = router;
