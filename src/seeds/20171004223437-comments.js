const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const quantity = 300;
    const data = [];
    for (let i = 0; i < quantity; i += 1) {
      let parentType;
      if (i < 200) {
        parentType = faker.random.number({ min: 1, max: 2 });
      } else {
        parentType = 3;
      }
      let { c, q, e } = { c: null, q: null, e: null };
      if (parentType === 1 || i < 3) {
        e = faker.random.number({ min: 1, max: 25 });
      } else if (parentType === 2) {
        q = faker.random.number({ min: 1, max: 25 });
      } else {
        c = faker.random.number({ min: 1, max: 199 });
      }
      data.push({
        content: `${faker.lorem.sentence(1).slice(0, -1)} comment ${faker.lorem.paragraph()}`,
        userId: faker.random.number({ min: 1, max: 10 }),
        commentId: c,
        questionId: q,
        excerciseId: e,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('comments', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('comments', null, {}),
};
