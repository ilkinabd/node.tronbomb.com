const { TOKEN, ADMIN_TOKEN } = process.env;

const { errorRes } = require('@utils/res-builder');

const server = (req, res, next) => {
  const token = req.headers['maxie-token'];
  if (!token) errorRes(res, 401, 73400);
  if (token !== TOKEN) errorRes(res, 403, 73401);

  next();
};

const admin = (req, res, next) => {
  const token = req.headers['maxie-token'];
  if (!token) errorRes(res, 401, 73400);
  if (token !== ADMIN_TOKEN) errorRes(res, 403, 73401);

  next();
};

module.exports = {
  server,
  admin,
};
