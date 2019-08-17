const express = require('express');
const router = new express.Router();

const controller = require('@controllers/bomb');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/balanceOf')
  .get(server, validate('address'), controller.get.balanceOf);

// Setters

// Functions

// Events

module.exports = router;
