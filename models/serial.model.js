const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  sequelize.define('serial', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    slug: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    imageUrl: {
      allowNull: true,
      type: DataTypes.STRING
    }
  })
}