const express = require('express');
const router = new express.Router();

const controller = require('@controllers/wheel');
const { server } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/game')
  .get(server, validate('id', true), controller.get.game);

router.route('/get/games')
  .get(server, validate('fromTo', true), controller.get.games);

router.route('/get/game_bets')
  .get(server, validate('id', true), controller.get.gameBets);

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

router.route('/func/init')
  .post(server, controller.func.init);

router.route('/func/finish')
  .post(server, validate('id', false), controller.func.finish);

// Events

router.route('/events/init_game')
  .get(server, validate('fromTo', true), controller.events.initGame);

router.route('/events/take_bet')
  .get(server, validate('fromTo', true), controller.events.takeBet);

router.route('/events/finish_game')
  .get(server, validate('fromTo', true), controller.events.finishGame);

router.route('/events/player_win')
  .get(server, validate('fromTo', true), controller.events.playerWin);

router.route('/events/change_params')
  .get(server, validate('fromTo', true), controller.events.changeParams);

module.exports = router;
