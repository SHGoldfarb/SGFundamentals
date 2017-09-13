module.exports = function definecomment(sequelize, DataTypes) {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
    parentId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  });
  comment.associate = function associate(models) {
    // associations can be defined here
  };
  return comment;
};
