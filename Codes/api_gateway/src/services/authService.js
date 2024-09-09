const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { JwtToken } = require("../models");
const { CustomError } = require("../errors/customError");

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
    console.log(error);
    throw new CustomError("token_invalid", 401);
  }
};
module.exports = {
  verifyAccessToken,
};
