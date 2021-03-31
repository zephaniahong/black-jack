export default function initGameModel(sequelize, DataTypes) {
  return sequelize.define(
    'game',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      gameData: {
        type: DataTypes.JSON,
      },
      status: {
        type: DataTypes.STRING,
      },
      turn: {
        type: DataTypes.INTEGER,
      },
      winnerId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'players',
          key: 'id',
          as: 'winnerId',
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      // The underscored option makes Sequelize reference snake_case names in the DB.
      underscored: true,
    },
  );
}
