const Joi = require('@hapi/joi');

const schemas = {
  setMainStatus: Joi.object().keys({
    status: Joi.boolean().required(),
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
