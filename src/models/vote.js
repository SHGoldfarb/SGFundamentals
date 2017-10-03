'use strict';
module.exports = (sequelize, DataTypes) => {
  var Vote = sequelize.define('vote', {
    type: DataTypes.BOOLEAN
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
