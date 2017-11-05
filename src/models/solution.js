module.exports = (sequelize, DataTypes) => {
  const solution = sequelize.define('solution', {
    content: DataTypes.STRING,
  });
  solution.associate = function associate(models) {
    solution.hasMany(models.comment);
    solution.hasMany(models.vote);
    solution.belongsTo(models.excercise);
    solution.belongsTo(models.user);
  };
  return solution;
};
