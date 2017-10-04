const faker = require('faker');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('userRoles', [{
      userId: 1,
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userRoles', null, {});
  },
};
