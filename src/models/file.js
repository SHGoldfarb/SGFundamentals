module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define('file', {
    title: DataTypes.STRING,
    filename: DataTypes.STRING,
  });
  file.associate = function associate(models) {
    file.belongsTo(models.user);
    file.belongsToMany(models.tag, { through: 'filetags' });
    file.belongsTo(models.guide);
  };
  return file;
};
