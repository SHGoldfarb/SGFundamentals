const faker = require('faker');

module.exports = {
  up(queryInterface, Sequelize) {
    const quantity = 10;
    const data = [];
    data.push({
      userId: 1,
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    for (let i = 0; i < quantity; i += 1) {
      data.push({
        userId: i + 1,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('userroles', data);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userroles', null, {});
  },
};
