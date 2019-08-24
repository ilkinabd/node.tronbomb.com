const express = require('express');
const router = new express.Router();

const controller = require('@controllers/wheel');
const { server, admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/bet')
  .get(server, validate('index'), controller.get.bet);

router.route('/get/bets')
  .get(server, validate('fromTo'), controller.get.bets);

router.route('/get/params')
  .get(server, controller.get.params);

// Setters

router.route('/set/duration')
  .post(admin, validate('value', false), controller.set.duration);

router.route('/set/portal')
  .post(admin, validate('address', false), controller.set.portal);

// Functions

router.route('/func/rng')
  .get(server, validate('wheelRNG'), controller.func.rng);

router.route('/func/finish')
  .post(server, controller.func.finish);

// Events

router.route('/events/take_bet')
  .get(server, validate('events'), controller.events.takeBet);

router.route('/events/player_win')
  .get(server, validate('events'), controller.events.playerWin);

module.exports = router;
