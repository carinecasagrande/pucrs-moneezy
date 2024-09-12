const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Budget = sequelize.define(
    "Budget",
    {
      date: {
        type: DataTypes.DATEONLY,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      tableName: "budget",
      timestamps: true,
      indexes: [
        {
          fields: ["user_id"],
        },
      ],
    }
  );

  return Budget;
};
