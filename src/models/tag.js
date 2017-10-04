module.exports = function definetag(sequelize, DataTypes) {
  const tag = sequelize.define('tag', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  });
  tag.associate = function associate(models) {
    // associations can be defined here
    tag.belongsToMany(models.question, { through: 'questiontags' });
    tag.belongsToMany(models.excercise, { through: 'excercisetags' });
    tag.belongsToMany(models.file, { through: 'filetags' });
    tag.belongsToMany(models.guide, { through: 'guidetags' });
  };
  return tag;
};
