module.exports = (sequelize, DataTypes) => {
  const vote = sequelize.define('vote', {
    type: DataTypes.BOOLEAN,
  });
  vote.associate = function associate(models) {
    vote.belongsTo(models.guide);
    vote.belongsTo(models.comment);
    vote.belongsTo(models.question);
    vote.belongsTo(models.excercise);
    vote.belongsTo(models.solution);
    vote.belongsTo(models.user);
  };
  vote.prototype.setResource = async function setResource(resource) {
    switch (resource._modelOptions.name.singular) {
      case 'question':
        this.setQuestion(resource);
        break;
      case 'comment':
        this.setComment(resource);
        break;
      case 'excercise':
        this.setExcercise(resource);
        break;
      case 'guide':
        this.setGuide(resource);
        break;
      default:
        break;
    }
  };

  return vote;
};
