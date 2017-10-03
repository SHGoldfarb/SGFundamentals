'use strict';
module.exports = (sequelize, DataTypes) => {
  var Solution = sequelize.define('Solution', {
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        solution.hasMany(models.comment);
        solution.hasMany(models.vote);
        solution.belongsTo(models.excercise);
        solution.belongsTo(models.user);
      }
    }
  });
  return Solution;
};