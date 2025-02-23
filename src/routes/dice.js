const express = require('express');
const router = new express.Router();

const controller = require('@controllers/dice');
const { server, admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/game')
  .get(server, validate('index'), controller.get.game);

router.route('/get/games')
  .get(server, validate('fromTo'), controller.get.games);

router.route('/get/params')
  .get(server, controller.get.params);

// Setters

router.route('/set/portal')
  .post(admin, validate('address', false), controller.set.portal);

router.route('/set/rtp')
  .post(admin, validate('rtp', false), controller.set.rtp);

// Functions

router.route('/func/rng')
  .get(server, validate('diceRNG'), controller.func.rng);

router.route('/func/finish_game')
  .post(server, validate('index', false), controller.func.finishGame);

// Events

router.route('/events/take_bet')
  .get(server, validate('events'), controller.events.takeBet);

router.route('/events/finish_game')
  .get(server, validate('events'), controller.events.finishGame);

router.route('/events/players_win')
  .get(server, validate('events'), controller.events.playersWin);

router.route('/events/set_rtp')
  .get(server, validate('events'), controller.events.setRTP);

module.exports = router;
