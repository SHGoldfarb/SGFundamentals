'use strict';
module.exports = (sequelize, DataTypes) => {
  var Guide = sequelize.define('Guide', {
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