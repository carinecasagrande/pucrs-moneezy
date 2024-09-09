const { Sequelize } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  logging: false,
});

const User = require("./user")(sequelize);
const JwtToken = require("./jwtToken")(sequelize);
const PasswordReset = require("./passwordReset")(sequelize);

User.hasMany(JwtToken, { foreignKey: "user_id", as: "jwtTokens" });
JwtToken.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(PasswordReset, { foreignKey: "user_id", as: "passwordResets" });
PasswordReset.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  User,
  JwtToken,
  PasswordReset,
};
