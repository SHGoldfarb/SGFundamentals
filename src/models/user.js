module.exports = function defineuser(sequelize, DataTypes) {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
  });
  user.associate = function associate(models) {
    // associations can be defined here
    user.belongsToMany(models.role, { through: 'userRole' });
  };
  return user;
};
