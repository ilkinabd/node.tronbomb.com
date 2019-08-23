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

module.exports = router;
