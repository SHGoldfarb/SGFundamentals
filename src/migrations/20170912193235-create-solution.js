
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('solutions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    content: {
      type: Sequelize.STRING,
    },
    excerciseId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'excercises',
        key: 'id',
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('solutions'),
};
