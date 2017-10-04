module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define('file', {
    path: DataTypes.STRING,
  });
  file.associate = function associate(models) {
    file.belongsTo(models.user);
    file.belongsToMany(models.tag, { through: 'filetags' });
  };
  return file;
};
