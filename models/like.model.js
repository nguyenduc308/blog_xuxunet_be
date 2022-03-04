const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'like',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      cat: {
        allowNull: false,
        type: DataTypes.ENUM('post', 'comment'),
        defaultValue: 'post',
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM(
          'like',
          'heart',
          'smile',
          'haha',
          'angry',
          'sad',
          'unlike',
        ),
        defaultValue: 'like',
      },
    },
    {
      timestamps: false,
    },
  );
};
