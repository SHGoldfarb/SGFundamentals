const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const quantity = 5;
    const data = [];
    for (let i = 0; i < quantity; i += 1) {
      data.push({
        title: faker.lorem.sentence(),
        userId: faker.random.number({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('guides', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('guides', null, {}),
};
