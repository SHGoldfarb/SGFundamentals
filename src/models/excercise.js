'use strict';

module.exports = function defineexcercise(sequelize, DataTypes) {
  const excercise = sequelize.define('excercise', {
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    guide_id: DataTypes.INTEGER,
  });
  excercise.associate = function associate(models) {
    // associations can be defined here
  };
  return excercise;
};
