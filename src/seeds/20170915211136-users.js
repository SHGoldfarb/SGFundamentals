const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const rolesId = (await queryInterface.select(null, 'roles', { attributes: ['id'] }))
      .map(role => role.id);

    const usersBulkInsertPromises = rolesId.map((role) => {
      const quantity = role === 1 ? 1 : faker.random.number({ min: 1, max: 15 });
      const data = [];
      for (let i = 0; i < quantity; i += 1) {
        data.push({
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return queryInterface.bulkInsert('users', data);
    });
    return Promise.all(usersBulkInsertPromises);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {}),
};
