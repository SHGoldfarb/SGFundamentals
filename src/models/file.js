'use strict';
module.exports = (sequelize, DataTypes) => {
  var File = sequelize.define('File', {
    path: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        file.belongsTo(models.user)
      }
    }
  });
  return File;
};