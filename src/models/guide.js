module.exports = (sequelize, DataTypes) => {
  const guide = sequelize.define('guide', {
    title: DataTypes.STRING,
  });
  guide.associate = function associate(models) {
    guide.hasMany(models.excercise);
    guide.belongsTo(models.user);
    guide.hasMany(models.vote);
  };
  return guide;
};
