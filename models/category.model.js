const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'category',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      slug: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM('deleted', 'draft', 'public'),
        defaultValue: 'public',
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      color: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      bg_color: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      underscored: true,
    },
  );
};
