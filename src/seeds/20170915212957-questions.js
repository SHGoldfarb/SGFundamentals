const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const quantity = 25;
    const data = [];
    for (let i = 0; i < quantity; i += 1) {
      data.push({
        title: `${faker.lorem.sentence(1).slice(0, -1)} question ${faker.lorem.sentence()}`,
        content: faker.lorem.paragraph(),
        userId: faker.random.number({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('questions', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('questions', null, {}),
};
