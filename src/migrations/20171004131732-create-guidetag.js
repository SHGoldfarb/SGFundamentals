module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('guidetags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      guideId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'guides',
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
    return queryInterface.dropTable('guidetags');
  },
};
