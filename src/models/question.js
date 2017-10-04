module.exports = function definequestion(sequelize, DataTypes) {
  const question = sequelize.define('question', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    content: DataTypes.TEXT,
  });
  question.associate = function associate(models) {
    question.belongsTo(models.user);
    question.hasMany(models.comment);
    question.belongsToMany(models.tag, { through: 'questiontags' });
  };
  return question;
};
