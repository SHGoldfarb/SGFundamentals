module.exports = function definecomment(sequelize, DataTypes) {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
  });
  comment.associate = function associate(models) {
    comment.belongsTo(models.user);
    comment.belongsTo(models.comment);
    comment.belongsTo(models.question);
    comment.belongsTo(models.excercise);
    comment.belongsTo(models.solution);
    comment.hasMany(models.comment);
    comment.hasMany(models.vote);
  };
  return comment;
};
