const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const tags = ['MAT1610', 'MAT1620', 'MAT1630', 'MAT1640', 'FIS1513',
      'FIS1523', 'FIS1533', 'Etica', 'Excel', 'MAT1203', 'IIC1103',
      'Matematicas', 'Buen Material', 'Revisado', 'Fisicos',
    ];
    const data = [];
    for (let i = 0; i < tags.length; i += 1) {
      data.push({
        name: tags[i],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('tags', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('tags', null, {}),
};
