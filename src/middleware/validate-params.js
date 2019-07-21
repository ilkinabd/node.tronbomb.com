const Joi = require('@hapi/joi');

const templates = {
  status: Joi.boolean().required(),
  amount: Joi.number().min(0).required(),
  id: Joi.number().integer().min(0).required(),
  address: Joi.string().alphanum().length(34).required(),
  bytes: Joi.string().regex(/0[xX][0-9a-fA-F]+/m),
  rtp: Joi.number().min(0.001).max(1.000).required(),
  from: Joi.number().integer().min(0),
  to: Joi.number().integer().min(Joi.ref('from')),
};

const portal = {
  getToken: Joi.object().keys({
    tokenId: templates.id,
  }),
  getGame: Joi.object().keys({
    gameId: templates.id,
  }),
  getGameStatus: Joi.object().keys({
    address: templates.address,
  }),
  setMainStatus: Joi.object().keys({
    status: templates.status,
  }),
  setToken: Joi.object().keys({
    tokenId: templates.id,
    address: templates.address,
  }),
  setGame: Joi.object().keys({
    gameId: templates.id,
    address: templates.address,
  }),
  setGameStatus: Joi.object().keys({
    address: templates.address,
    status: templates.status,
  }),
  takeTRXBet: Joi.object().keys({
    amount: templates.amount,
    gameId: templates.id,
    data: Joi.array().items(templates.bytes).min(2).required(),
  }),
  withdraw: Joi.object().keys({
    amount: templates.amount,
    tokenId: templates.id,
  }),
  events: Joi.object().keys({
    from: templates.from,
    to: templates.to,
  }),
};

const dice = {
  getGame: Joi.object().keys({
    gameId: templates.id,
  }),
  setPortal: Joi.object().keys({
    address: templates.address,
  }),
  setRTP: Joi.object().keys({
    rtp: templates.rtp,
  }),
  setBet: Joi.object().keys({
    min: templates.amount,
    max: Joi.number().min(Joi.ref('min')).required(),
  }),
  finishGame: Joi.object().keys({
    gameId: templates.id,
  }),
  events: Joi.object().keys({
    from: templates.from,
    to: templates.to,
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
