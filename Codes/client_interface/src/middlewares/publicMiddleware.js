const publicMiddleware = async (req, res, next) => {
  const token = req.cookies.moneezy_token;
  if (token) {
    res.redirect("/");
  }
  next();
};

module.exports = publicMiddleware;
