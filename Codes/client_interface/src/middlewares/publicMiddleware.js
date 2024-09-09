const publicMiddleware = async (req, res, next) => {
  const token = req.cookies.moneezy_token;
  if (token) {
    return res.redirect("/");
  }
  next();
};

module.exports = publicMiddleware;
