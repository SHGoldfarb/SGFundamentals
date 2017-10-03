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
  return vote;
};
