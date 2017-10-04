const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const quantity = faker.random.number({ min: 10, max: 30 });
    const data = [];
    for (let i = 0; i < quantity; i += 1) {
      data.push({
        title: faker.lorem.words(faker.random.number({ min: 10, max: 15 })),
        content: faker.lorem.paragraph(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('questions', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('questions', null, {}),
};
