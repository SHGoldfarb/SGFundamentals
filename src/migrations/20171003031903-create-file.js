
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('files', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    filename: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
      allowNull: false,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('files'),
};
