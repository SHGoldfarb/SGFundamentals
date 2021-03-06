module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('excercisetags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      excerciseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'excercises',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tags',
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
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('excercisetags');
  },
};
