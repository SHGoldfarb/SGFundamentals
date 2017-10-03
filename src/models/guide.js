'use strict';
module.exports = (sequelize, DataTypes) => {
  var Guide = sequelize.define('guide', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        guide.hasMany(models.excercise);
        guide.belongsTo(models.user);
        guide.hasMany(models.vote);
      }
    }
  });
  return Guide;
};
