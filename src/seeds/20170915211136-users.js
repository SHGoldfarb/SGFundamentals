const faker = require('faker');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      email: 'admin@admin',
      username: 'admin',
      password: '$2a$13$fDSlLxQUc.7lof75citqbO.9x48dtnXWJvhkXWCCJ81j2nANV5Brq',
      activeToken: null,
      actived: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user@user',
      username: 'user',
      password: '$2a$13$Gt1AxSg3kTE2Um4TgEGexOaLgiFR4MJ3vLU6UQnxlDXvFUm0KlI5m',
      activeToken: null,
      actived: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
