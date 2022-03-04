const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(100),
        unique: true,
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM('user', 'mod', 'admin'),
        defaultValue: 'user',
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [6, 80],
            msg: 'Minimun length is 6',
          },
        },
      },
      first_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      last_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      avatar_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      underscored: true,
    },
  );

  User.beforeSave(function (user) {
    if (user.changed() && user.changed().includes('password')) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(user.password, salt);
    }
  });

  return User;
};
