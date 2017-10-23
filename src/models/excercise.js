// 'use strict';

module.exports = function defineexcercise(sequelize, DataTypes) {
  const excercise = sequelize.define('excercise', {
    content: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    guideId: DataTypes.INTEGER,
  });
  excercise.associate = function associate(models) {
    excercise.hasMany(models.comment);
    excercise.hasMany(models.vote);
    excercise.hasMany(models.report);
    excercise.hasMany(models.solution);
    excercise.belongsTo(models.guide);
    excercise.belongsTo(models.user);
    excercise.belongsToMany(models.tag, { through: 'excercisetags' });
  };
  return excercise;
};
