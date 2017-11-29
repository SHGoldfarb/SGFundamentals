const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const titles = [
      'Examen completo marzo 2016', 'Modulo matematicas 2016-1', 'Guia de ejercicios calculo III',
      'Modulo fisica 2016-2', 'Compilacion fisica v2.0',
    ];
    const data = [];
    for (let i = 0; i < titles.length; i += 1) {
      data.push({
        title: titles[i],
        userId: faker.random.number({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('guides', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('guides', null, {}),
};
