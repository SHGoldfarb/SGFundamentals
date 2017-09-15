const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const quantity = faker.random.number({min: 10, max: 30});
    const data = []
    for(let i = 0; i < quantity; i++){
      data.push({
        title: faker.lorem.words(faker.random.number({min:10,max:15})),
        content: faker.lorem.paragraph(),
        userId: faker.random.number({min: 1,max:10}),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('questions', data);
    return Sequelize.all(excercisesBulkInsertPromises)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('questions', null, {});
  }
};
