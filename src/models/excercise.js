'use strict';
module.exports = (sequelize, DataTypes) => {
  var excercise = sequelize.define('excercise', {
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    guide_id:DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return excercise;
};
