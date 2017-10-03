module.exports = function definequestion(sequelize, DataTypes) {
  const question = sequelize.define('question', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  });
  question.associate = function associate(models) {
    question.belongsTo(models.user);
    question.hasMany(models.comment);
  };
  return question;
};
