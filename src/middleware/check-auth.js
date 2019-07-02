const { TOKEN } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers['maxie-token'];

  if (!token) return res.status(401).json({
    status: 'error',
    message: 'No token provided.'
  });

  if (token !== TOKEN) return res.status(403).json({
    status: 'error',
    message: 'Wrong token.'
  });

  next();
};
