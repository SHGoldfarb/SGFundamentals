module.exports = function definecomment(sequelize, DataTypes) {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
    parentId: DataTypes.INTEGER,
    // type: 'answer' si parentId es un ejercicio,
    //       'reply' si parentId es una respuesta,
    //       'comment' si parntId es un comentario
    type: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  });
  comment.associate = function associate(models) {
    // associations can be defined here
  };
  return comment;
};
