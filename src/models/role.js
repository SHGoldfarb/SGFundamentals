module.exports = function definerole(sequelize, DataTypes) {
  const role = sequelize.define('role', {
    tag: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  });
  role.associate = function associate(models) {
    // associations can be defined here
    role.belongsToMany(models.user, { through: 'userroles' });
  };
  return role;
};
