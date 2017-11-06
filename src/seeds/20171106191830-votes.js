const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const quantityUsers = 10;
    const quantityGuides = 5;
    const quantityExcercises = 25;
    const quantityQuestions = 25;
    const quantityComments = 400;
    const data = [];
    for (let j = 1; j <= quantityUsers; j += 1) {
      for (let i = 1; i <= quantityGuides; i += 1) {
        data.push({
          type: faker.random.number({ min: 1, max: 4 }) < 4,
          guideId: i,
          userId: j,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      for (let i = 1; i <= quantityExcercises; i += 1) {
        data.push({
          type: faker.random.number({ min: 1, max: 4 }) < 4,
          excerciseId: i,
          userId: j,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      for (let i = 1; i <= quantityQuestions; i += 1) {
        data.push({
          type: faker.random.number({ min: 1, max: 4 }) < 4,
          questionId: i,
          userId: j,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      for (let i = 1; i <= quantityComments; i += 1) {
        data.push({
          type: faker.random.number({ min: 1, max: 4 }) < 4,
          commentId: i,
          userId: j,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    return queryInterface.bulkInsert('votes', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('votes', null, {}),
};
