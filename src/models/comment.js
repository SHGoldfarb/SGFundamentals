module.exports = function definecomment(sequelize, DataTypes) {
  const comment = sequelize.define('comment', {
    content: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
      },
    },

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

  comment.prototype.getParent = async function getParent() {
    const parent = await this.getComment() || await this.getQuestion() || await this.getExcercise();
    return parent;
  };

  comment.prototype.getParentTypeStr = async function getParentTypeStr() {
    let ret;
    if (await this.getComment()) {
      ret = 'comment';
    } else if (await this.getQuestion()) {
      ret = 'question';
    } else if (await this.getExcercise()) {
      ret = 'excercise';
    } else {
      throw new Error('Comment has no parent');
    }
    return ret;
  };

  comment.prototype.isParentComment = async function isParentComment() {
    const ret = !!await this.getComment();
    return ret;
  };

  comment.prototype.isParentQuestion = async function isParentQuestion() {
    const ret = !!await this.getQuestion();
    return ret;
  };

  comment.prototype.isParentExcercise = async function isParentExcercise() {
    const ret = !!await this.getExcercise();
    return ret;
  };

  return comment;
};
