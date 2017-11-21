
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('votes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.BOOLEAN,
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
      onDelete: 'cascade',
    },
    commentId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'comments',
        key: 'id',
      },
      onDelete: 'cascade',
    },
    questionId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'questions',
        key: 'id',
      },
      onDelete: 'cascade',
    },
    excerciseId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'excercises',
        key: 'id',
      },
      onDelete: 'cascade',
    },
    solutionId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'solutions',
        key: 'id',
      },
      onDelete: 'cascade',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('votes'),
};
