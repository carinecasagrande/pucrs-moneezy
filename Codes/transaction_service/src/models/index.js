const { Sequelize } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  logging: false,
});

const Transaction = require("./transaction")(sequelize);
const Balance = require("./balance")(sequelize);

module.exports = {
  sequelize,
  Transaction,
  Balance,
};
