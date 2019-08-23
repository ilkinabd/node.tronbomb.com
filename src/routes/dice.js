const express = require('express');
const router = new express.Router();

const controller = require('@controllers/dice');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/game')
  .get(server, validate('index'), controller.get.game);

router.route('/get/games')
  .get(server, validate('fromTo', true), controller.get.games);

router.route('/get/params')
  .get(server, controller.get.params);

router.route('/get/rng')
  .get(server, validate('addressBlockHash', true), controller.get.rng);

// Setters

router.route('/set/portal')
  .post(server, validate('address', false), controller.set.portal);

router.route('/set/rtp')
  .post(server, validate('rtp', false), controller.set.rtp);

router.route('/set/bet')
  .post(server, validate('bet', false), controller.set.bet);

// Functions

router.route('/func/finish_game')
  .post(server, validate('id', false), controller.func.finishGame);

// Events

router.route('/events/take_bet')
  .get(server, validate('fromTo', true), controller.events.takeBet);

router.route('/events/finish_game')
  .get(server, validate('fromTo', true), controller.events.finishGame);

router.route('/events/players_win')
  .get(server, validate('fromTo', true), controller.events.playersWin);

router.route('/events/change_params')
  .get(server, validate('fromTo', true), controller.events.changeParams);

module.exports = router;
