const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("I", "O"),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.CHAR(7),
        allowNull: false,
        defaultValue: "#4e4e4e",
      },
      icon: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        defaultValue: "&#xe137;",
      },
    },
    {
      tableName: "categories",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "name"],
        },
        {
          fields: ["user_id"],
        },
      ],
    }
  );

  return Category;
};
