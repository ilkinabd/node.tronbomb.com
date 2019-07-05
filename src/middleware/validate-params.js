const Joi = require('@hapi/joi');

const portal = {
  setMainStatus: Joi.object().keys({
    status: Joi.boolean().required(),
  }),
  statusEvents: Joi.object().keys({
    from: Joi.number().integer().min(0),
    to: Joi.number().integer().min(Joi.ref('from')),
  }),
  withdraw: Joi.object().keys({
    amount: Joi.number().min(0).required(),
    tokenId: Joi.number().integer().min(0).required(),
  }),
  getToken: Joi.object().keys({
    tokenId: Joi.number().integer().min(0).required(),
  }),
  setToken: Joi.object().keys({
    tokenId: Joi.number().integer().min(0).required(),
    address: Joi.string().alphanum().length(34).required(),
  }),
  getGame: Joi.object().keys({
    gameId: Joi.number().integer().min(0).required(),
  }),
  setGame: Joi.object().keys({
    gameId: Joi.number().integer().min(0).required(),
    address: Joi.string().alphanum().length(34).required(),
  }),
  getGameStatus: Joi.object().keys({
    address: Joi.string().alphanum().length(34).required(),
  }),
  setGameStatus: Joi.object().keys({
    address: Joi.string().alphanum().length(34).required(),
    status: Joi.boolean().required(),
  }),
  takeTRXBet: Joi.object().keys({
    amount: Joi.number().min(0).required(),
    gameId: Joi.number().integer().min(0).required(),
    data: Joi.array().items(
      Joi.string().regex(/0[xX][0-9a-fA-F]+/m)
    ).min(2).required(),
  }),
};

const dice = {
  getGame: Joi.object().keys({
    contractId: Joi.number().integer().min(0).required(),
    gameId: Joi.number().integer().min(0).required(),
  }),
  getGames: Joi.object().keys({
    contractId: Joi.number().integer().min(0).required(),
  }),
  getParams: Joi.object().keys({
    contractId: Joi.number().integer().min(0).required(),
  }),
};

const validate = (schemas, type, isQuery) => (req, res, next) => {
  const schema = schemas[type];
  const data = (isQuery) ? req.query : req.body;

  const { error } = Joi.validate(data, schema);

  if (error) return res.status(422).json({
    status: 'error',
    message: error.details,
  });

  next();
};

const validatePortal = (type, isQuery) => validate(portal, type, isQuery);
const validateDice = (type, isQuery) => validate(dice, type, isQuery);

module.exports = {
  validatePortal,
  validateDice,
};
