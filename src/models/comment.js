module.exports = function definecomment(sequelize, DataTypes) {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
    parentId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  });
  comment.associate = function associate(models) {
    // associations can be defined here
  };
  return comment;
};
