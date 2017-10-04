module.exports = function definerole(sequelize, DataTypes) {
  const role = sequelize.define('role', {
    tag: DataTypes.STRING,
  });
  role.associate = function associate(models) {
    // associations can be defined here
    role.belongsToMany(models.user, { through: 'userroles' });
  };
  return role;
};
