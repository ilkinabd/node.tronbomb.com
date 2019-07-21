const { TOKEN, ADMIN_TOKEN } = process.env;

const { resError } = require('@utils/res-builder');

const server = (req, res, next) => {
  const token = req.headers['maxie-token'];
  if (!token) return res.status(401).json(resError(73400));
  if (token !== TOKEN) return res.status(403).json(resError(73401));

  next();
};

const admin = (req, res, next) => {
  const token = req.headers['maxie-token'];
  if (!token) return res.status(401).json(resError(73400));
  if (token !== ADMIN_TOKEN) return res.status(403).json(resError(73401));

  next();
};

module.exports = {
  server,
  admin,
};
