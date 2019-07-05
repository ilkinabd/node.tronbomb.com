const express = require('express');
const router = new express.Router();

const controller = require('@controllers/dice');
const auth = require('@middleware/check-auth');
const { validateDice: validate } = require('@middleware/validate-params');

// Getters

router.route('/get/game')
  .get(auth, validate('getGame', true), controller.get.game);

router.route('/get/games')
  .get(auth, validate('getGames', true), controller.get.games);

router.route('/get/params')
  .get(auth, validate('getParams', true), controller.get.params);

// Setters

router.route('/set/portal')
  .post(auth, validate('setPortal', false), controller.set.portal);

// Control

// Events

module.exports = router;
