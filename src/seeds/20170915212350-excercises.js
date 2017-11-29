const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const numberGuideContent = [
      [8, 1, '¿Cuál de las siguientes afirmaciones es FALSA respecto a las reacciones óxido-reducción?\na) Las reacciones electroquímicas implican transferencia de electrones, pero no todas son reacciones redox\nb) Las reacciones redox implican la transferencia de electrones entre los elementos involucrados\nc) Las ecuaciones que representan procesos redox pueden equilibrarse utilizando el método de ion-electrón.\nd) La corrosión de los metales, tales como la oxidación del hierro, es un fenómeno electroquímico.'],
      [9, 1, 'Un recipiente de 2.5 L a 15 °C contiene una mezcla de gases (N 2 , He y Ne); las presiones parciales son P N2 = 0.32 atm, P He = 0.15 atm, P Ne = 0.42 atm. Determinar la presión total del sistema.\na) 0.89 atm\nb) 0.32 atm\nc) 1.00 atm\nd) No se puede determinar con la información entregada.'],
      [10, 1, '¿Cuántos gramos de NaNO 3 contiene 250 mL de una solución 0.707 M?\na) 0.18 g\nb) 0.24 g\nc) 15 g\nd) 15000 g'],
      [11, 1, 'Las cuestiones de la ética:\na) Afectan a cada persona de un modo íntimo.\nb) Sólo orientan el modo de relacionarse con la familia.\nc) Se refieren exclusivamente al ámbito profesional.\nd) Se refieren solo mi comportamiento personal.'],
    ];
    const data = [];
    for (let i = 0; i < numberGuideContent.length; i += 1) {
      data.push({
        content: numberGuideContent[i][2],
        number: numberGuideContent[i][0],
        guideId: numberGuideContent[i][1],
        userId: faker.random.number({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('excercises', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('excercises', null, {}),
};
