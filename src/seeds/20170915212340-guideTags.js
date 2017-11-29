const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const quantity = 2;
    const data = [];
    for (let i = 0; i < quantity; i += 1) {
      const ntags = faker.random.number({ min: 1, max: 5 });
      for (let j = 0; j < ntags; j += 1) {
        data.push({
          guideId: i + 1,
          tagId: faker.random.number({ min: 1, max: 15 }),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    return queryInterface.bulkInsert('guidetags', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('guidetags', null, {}),
};
