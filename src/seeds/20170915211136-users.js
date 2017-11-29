const faker = require('faker');

module.exports = {
  up(queryInterface, Sequelize) {
    const names = ['Sam', 'Gabo', 'John', 'Rodolfo', 'Raul_M', 'M_Bachellet',
      'S_Piniera', 'Elon_M', 'Bill_G'];
    const data = [];
    data.push({
      email: 'linust@sglabs.com',
      username: 'Linus_T',
      password: '$2a$13$fDSlLxQUc.7lof75citqbO.9x48dtnXWJvhkXWCCJ81j2nANV5Brq',
      activeToken: null,
      actived: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    for (let i = 0; i < names.length; i += 1) {
      data.push({
        email: `${names[i].replace(/[_\W]+|([0-9])/g, '').toLowerCase()}@sglabs.com`,
        username: names[i],
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
