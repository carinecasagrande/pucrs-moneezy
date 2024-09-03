const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      audit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
      tableName: "audit_logs",
      timestamps: false,
    }
  );

  return AuditLog;
};
