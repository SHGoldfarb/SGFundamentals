const faker = require('faker');

module.exports = {
  up(queryInterface, Sequelize) {
    const quantity = 9;
    const data = [];
    data.push({
      email: 'admin@admin',
      username: 'admin',
      password: '$2a$13$fDSlLxQUc.7lof75citqbO.9x48dtnXWJvhkXWCCJ81j2nANV5Brq',
      activeToken: null,
      actived: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    for (let i = 0; i < quantity; i += 1) {
      data.push({
        email: `user${i + 1}@users`,
        username: `user${i + 1}`,
        password: '$2a$13$Gt1AxSg3kTE2Um4TgEGexOaLgiFR4MJ3vLU6UQnxlDXvFUm0KlI5m',
        activeToken: null,
        actived: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('users', data);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
