const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'attachment',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      path: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      createdAt: true,
      underscored: true,
    },
  );
};
