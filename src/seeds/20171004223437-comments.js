const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const cqeContent = [
      [null, null, 1, 'Es la a), se ve en Quimica II.'],
      [1, null, null, 'Seguro? Porque a mi me tinca la b).'],
      [null, null, 1, 'No tengo idea, te juro que no me acuerdo de nada de quimica.'],
      [null, null, 1, 'Según el libro es la a), todas las demás son verdaderas'],
      [4, null, null, 'Bueena! Upvoted :)'],
      [null, 2, null, 'Lo puedes reprobar 3 veces y luego tienes que hacer los ramos que reprobaste de nuevo antes de darlo por 4ta vez'],
      [6, null, null, 'Tenia la misma duda, gracias!'],
      [null, 2, null, '4 veces! Tienes que hacer unos ramos antes eso si, y si te lo echas de nuevo ahi si que no se que pasa. Pregunta en la dipre.'],
      [null, null, 4, 'Pa ke quieres saber eso jajaja saludos.'],
    ];
    // const quantity = 400;
    const data = [];
    for (let i = 0; i < cqeContent.length; i += 1) {
      // let parentType;
      // if (i < 150) {
      //   parentType = faker.random.number({ min: 1, max: 2 });
      // } else {
      //   parentType = 3;
      // }
      // let { c, q, e } = { c: null, q: null, e: null };
      // if (parentType === 1 || i < 3) {
      //   e = faker.random.number({ min: 1, max: 4 });
      // } else if (parentType === 2) {
      //   q = faker.random.number({ min: 1, max: 4 });
      // } else {
      //   c = faker.random.number({ min: 1, max: 149 });
      // }
      data.push({
        content: cqeContent[i][3],
        userId: faker.random.number({ min: 1, max: 10 }),
        commentId: cqeContent[i][0],
        questionId: cqeContent[i][1],
        excerciseId: cqeContent[i][2],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('comments', data);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('comments', null, {}),
};
