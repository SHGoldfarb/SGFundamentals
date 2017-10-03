// 'use strict';

module.exports = function defineexcercise(sequelize, DataTypes) {
  const excercise = sequelize.define('excercise', {
    content: DataTypes.STRING,
    guide_id: DataTypes.INTEGER,
  });
  excercise.associate = function associate(models) {
    excercise.belongsTo(models.user);
    excercise.hasMany(models.comment);
  };
  return excercise;
};
