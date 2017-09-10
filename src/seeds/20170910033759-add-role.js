module.exports = {
  up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('roles', [{
      id: 1,
      tag: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },


  // up(queryInterface, Sequelize) {
  //   return queryInterface.bulkInsert('roles', [{
  //     id: 1,
  //     tag: 'admin',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   }]);
  // },

  down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('roles', null, {});
  },
};
