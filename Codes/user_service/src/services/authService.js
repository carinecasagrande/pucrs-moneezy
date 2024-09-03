const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { JwtToken } = require("../models");
const { CustomError } = require("../errors/customError");

/**
 * Generates the user's access token
 */
const generateAccessToken = async (req, user, revokeOthers = false) => {
  if (revokeOthers) {
    await revokeTokens(user.user_id);
  }

  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];

  const payload = {
    id: user.user_id,
    email: user.email,
    username: user.username,
  };

  const token = jwt.sign(payload, config.jwt.secret);
  const decoded = jwt.decode(token);

  await JwtToken.create({
    user_id: user.user_id,
    token,
    issued_at: new Date(decoded.iat * 1000),
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  return token;
};

/**
 * Verify the access token.
 */
const verifyAccessToken = async (token) => {
  try {
    const tokenExists = await JwtToken.findOne({
      where: {
        token,
        revoked: false,
      },
    });
    if (!tokenExists) {
      throw new CustomError("token_expired", 400);
    }

    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new CustomError("token_invalid", 401);
  }
};

/**
 * Revokes a token.
 */
const revokeTokens = async (user_id) => {
  await JwtToken.update(
    { revoked: true },
    {
      where: {
        user_id,
      },
    }
  );
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  revokeTokens,
};
