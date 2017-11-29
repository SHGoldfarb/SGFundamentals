const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const titleContent = [
      ['¿Como se calcula la derivada de x²?', 'Eso, no me acuerdo como se hace. Es la derivada con respecto a x porsiaca.'],
      ['¿Cuantas veces puedo reprobar el fundamentals?', 'He escuchado que entre 3 y 4, ¿alguien sabe?'],
      ['Necesito material de precalculo.', 'Estaba mirando el sitio y no encontré, en verdad que lo necesito pa empezar a entender Calculo 1.'],
      ['Duda sobre derivadas parciales.', 'Si tengo f(x(u, v), y(u, v)), ¿como saco df/du? '],
    ];
    const data = [];
    for (let i = 0; i < titleContent.length; i += 1) {
      data.push({
        title: titleContent[i][0],
        content: titleContent[i][1],
        userId: faker.random.number({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('questions', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('questions', null, {}),
};
