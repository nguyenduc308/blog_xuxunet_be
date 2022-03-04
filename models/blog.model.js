const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'blog',
    {
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
        unique: true,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM('deleted', 'draft', 'public'),
        defaultValue: 'public',
      },
      image_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      excerpt: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      show_image: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      content: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: true,
      underscored: true,
    },
  );
};
