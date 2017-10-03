const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const quantity = faker.random.number({min: 10, max: 30});
    const data = []
    for(let i = 0; i < quantity; i++){
      data.push({
        content: faker.lorem.sentence(),
        // guideId: faker.random.number({min: 1,max:5}),
        userId: faker.random.number({min: 1,max:10}),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('excercises', data);
    return Sequelize.all(excercisesBulkInsertPromises)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('excercises', null, {});
  }
};
