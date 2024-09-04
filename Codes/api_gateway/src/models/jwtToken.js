const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const JwtToken = sequelize.define(
    "JwtToken",
    {
      token_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
      issued_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      tableName: "jwt_tokens",
      timestamps: false,
    }
  );

  return JwtToken;
};
