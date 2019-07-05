const express = require('express');
const router = new express.Router();

const controller = require('@controllers/dice');
const auth = require('@middleware/check-auth');
const { validateDice: validate } = require('@middleware/validate-params');

// Getters

router.route('/get/game')
  .get(auth, validate('getGame', true), controller.get.game);

// Setters

// Control

// Events

module.exports = router;
