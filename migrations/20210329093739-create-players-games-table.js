module.exports = {
  up: async (queryInterface, Sequelize) => {
    // players table
    await queryInterface.createTable('players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.TEXT,
      },
      password: {
        type: Sequelize.TEXT,
      },
      wins: {
        type: Sequelize.INTEGER,
      },
      losses: {
        type: Sequelize.INTEGER,
      },
      money: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // games table
    await queryInterface.createTable('games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      game_data: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.TEXT,
      },
      turn: {
        type: Sequelize.INTEGER,
      },
      winner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'players',
          key: 'id',
          as: 'winnerId',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // players_games table
    await queryInterface.createTable('player_games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      player_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'players',
          key: 'id',
        },
      },
      game_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'games',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('player_games');
    await queryInterface.dropTable('players');
    await queryInterface.dropTable('games');
  },
};
