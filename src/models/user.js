const bcrypt = require('bcrypt');

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, 13);
    instance.set('password', hash);
  }
}

module.exports = function defineuser(sequelize, DataTypes) {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
  });
  user.associate = function associate(models) {
    // associations can be defined here
    user.belongsToMany(models.role, { through: 'userRole' });
    user.hasMany(models.question);
    user.hasMany(models.excercise);
    user.hasMany(models.comment);
    user.hasMany(models.guide);
    user.hasMany(models.file);
    user.hasMany(models.vote);
    user.hasMany(models.solution);
  };
  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkpassword(password) {
    return bcrypt.compare(password, this.password);
  };

  user.prototype.isAdmin = async function isAdmin() {
    const roles = await this.getRoles();
    for (const i in roles) {
      if (roles[i].tag === 'admin') {
        return true;
      }
    }
    return false;
  };

  return user;
};
