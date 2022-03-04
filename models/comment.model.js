const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'comment',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: true,
    },
  );
};
