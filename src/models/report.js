module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define('report', {
    content: DataTypes.TEXT,
  });
  report.associate = function associate(models) {
    report.belongsTo(models.guide);
    report.belongsTo(models.comment);
    report.belongsTo(models.question);
    report.belongsTo(models.excercise);
    report.belongsTo(models.user);
  };

  return report;
};
