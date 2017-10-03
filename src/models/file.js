module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define('file', {
    path: DataTypes.STRING,
  });
  file.associate = function associate(models) {
    file.belongsTo(models.user);
  };
  return file;
};
