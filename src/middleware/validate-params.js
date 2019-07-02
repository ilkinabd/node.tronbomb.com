const Joi = require('@hapi/joi');

const schemas = {
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
};

const validate = (type, isQuery) => (req, res, next) => {
  const schema = schemas[type];
  const data = (isQuery) ? req.query : req.body;

  const { error } = Joi.validate(data, schema);

  if (error) return res.status(422).json({
    status: 'error',
    message: error.details,
  });

  next();
};

module.exports = validate;
