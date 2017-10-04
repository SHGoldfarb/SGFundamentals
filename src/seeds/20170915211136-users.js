const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('users', [{
      email: 'admin@admin',
      username: 'admin',
      password: '$2a$13$fDSlLxQUc.7lof75citqbO.9x48dtnXWJvhkXWCCJ81j2nANV5Brq',
      activeToken: null,
      actived: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
    queryInterface.bulkInsert('userRole', [{
      userId: 1,
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {}),
};
