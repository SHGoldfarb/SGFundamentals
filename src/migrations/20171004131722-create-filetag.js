module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('filetags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'files',
          key: 'id',
        },
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tags',
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
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('filetags');
  },
};
