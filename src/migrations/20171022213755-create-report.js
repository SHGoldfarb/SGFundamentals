
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('reports', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    content: {
      type: Sequelize.TEXT,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    guideId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'guides',
        key: 'id',
      },
    },
    commentId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'comments',
        key: 'id',
      },
    },
    questionId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'questions',
        key: 'id',
      },
    },
    excerciseId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'excercises',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('reports'),
};
