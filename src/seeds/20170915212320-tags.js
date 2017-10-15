const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const quantity = 15;
    const data = [];
    for (let i = 0; i < quantity; i += 1) {
      data.push({
        name: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('tags', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('tags', null, {}),
};
