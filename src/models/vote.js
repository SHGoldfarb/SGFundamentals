'use strict';
module.exports = (sequelize, DataTypes) => {
  var Vote = sequelize.define('Vote', {
    type: DataTypes.BOOL
  }, {
    classMethods: {
      associate: function(models) {
        vote.belongsTo(models.guide);
        vote.belongsTo(models.comment);
        vote.belongsTo(models.question);
        vote.belongsTo(models.excercise);
        vote.belongsTo(models.solution);
        vote.belongsTo(models.user);
      }
    }
  });
  return Vote;
};