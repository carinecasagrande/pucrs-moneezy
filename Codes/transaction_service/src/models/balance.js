const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Balance = sequelize.define(
    "Balance",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      value: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      tableName: "balance",
      timestamps: true,
    }
  );

  return Balance;
};
