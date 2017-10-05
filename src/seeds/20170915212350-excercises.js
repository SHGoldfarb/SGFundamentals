const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const quantity = 25;
    const data = [];
    for (let i = 0; i < quantity; i += 1) {
      data.push({
        content: faker.lorem.sentence(),
        guideId: faker.random.number({ min: 1, max: 5 }),
        userId: faker.random.number({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('excercises', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('excercises', null, {}),
};
