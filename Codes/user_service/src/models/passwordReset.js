const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PasswordReset = sequelize.define(
    "PasswordReset",
    {
      reset_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reset_token: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expired_by_use: {
        type: DataTypes.BOOLEAN,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "password_resets",
      timestamps: false,
    }
  );

  return PasswordReset;
};
