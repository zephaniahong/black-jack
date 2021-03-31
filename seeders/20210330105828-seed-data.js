const jsSHA = require('jssha');

const shaObj1 = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
const shaObj2 = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
shaObj1.update('jim');
shaObj2.update('jack');
const jimHashedPassword = shaObj1.getHash('HEX');
const jackHashedPassword = shaObj2.getHash('HEX');
module.exports = {
  up: async (queryInterface) => {
    // Define category data
    const players = [
      {
        name: 'Jim',
        email: 'jim@gmail.com',
        password: jimHashedPassword,
        wins: 5,
        losses: 3,
        money: 10000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Jack',
        email: 'jack@gmail.com',
        password: jackHashedPassword,
        wins: 2,
        losses: 1,
        money: 5000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('players', players);
  },
  down: async (queryInterface) => {
    // Delete rows from tables with foreign key references first
    await queryInterface.bulkDelete('players', null, {});
  },
};
