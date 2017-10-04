const bcrypt = require('bcrypt');
const faker = require('faker');

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, 13);
    instance.set('password', hash);
  }
}
async function buildActivationToken(instance) {
  const token = faker.random.alphaNumeric(50);
  instance.set('activeToken', token);
  instance.set('actived', false);
}

module.exports = function defineuser(sequelize, DataTypes) {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    activeToken: DataTypes.STRING,
    actived: DataTypes.BOOLEAN,
  });
  user.associate = function associate(models) {
    // associations can be defined here
    user.belongsToMany(models.role, { through: 'userroles' });
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
  user.beforeCreate(buildActivationToken);

  user.prototype.checkPassword = async function checkpassword(password) {
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
