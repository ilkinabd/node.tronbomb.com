const express = require('express');
const router = new express.Router();

const controller = require('@controllers/wheel');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/bet')
  .get(server, validate('index'), controller.get.bet);

router.route('/get/bets')
  .get(server, validate('fromTo', true), controller.get.bets);

router.route('/get/params')
  .get(server, controller.get.params);

router.route('/get/rng')
  .get(server, validate('blockHash', true), controller.get.rng);

// Setters

router.route('/set/portal')
  .post(server, validate('address', false), controller.set.portal);

router.route('/set/bet')
  .post(server, validate('bet', false), controller.set.bet);

router.route('/set/duration')
  .post(server, validate('duration', false), controller.set.duration);

// Functions

router.route('/func/finish')
  .post(server, controller.func.finish);

// Events

router.route('/events/take_bet')
  .get(server, validate('fromTo', true), controller.events.takeBet);

router.route('/events/player_win')
  .get(server, validate('fromTo', true), controller.events.playerWin);

router.route('/events/change_params')
  .get(server, validate('fromTo', true), controller.events.changeParams);

module.exports = router;
