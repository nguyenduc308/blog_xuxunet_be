const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'view',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      count: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
    },
  );
};
