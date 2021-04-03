import jsSHA from 'jssha';
import sequelizePackage from 'sequelize';

const { Op } = sequelizePackage;
export default function initPlayersController(db) {
  const login = async (req, res) => {
    res.render('login');
  };

  const verifyLogin = async (req, res) => {
    const { email, password } = req.body;
    // get password of user from db
    try {
      const player = await db.Player.findOne({
        where: { email },
      });
      // if email exists in the db
      if (player) {
      // check if password input is same as db
        const shaObj = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
        shaObj.update(password);
        const hashedPassword = shaObj.getHash('HEX');
        if (hashedPassword === player.dataValues.password) {
          res.cookie('playerId', player.dataValues.id);
          res.redirect(`/dashboard/${player.dataValues.id}`);
        }
      } else {
        res.send('Invalid credentials');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const dashboard = async (req, res) => {
    const { playerId } = req.cookies;
    try {
      // get player stats
      const player = await db.Player.findOne({
        where: {
          id: playerId,
        },
      });
      // find all games that logged in player is involved in
      const playerGames = await db.Game.findAll({
        include: [{
          model: db.Player,
          where: {
            id: playerId,
          },
        }],
      });
      const games = playerGames;
      console.log(games);
      // array of all game ids that logged in user is in
      const gameArray = [];
      for (let i = 0; i < games.length; i += 1) {
        gameArray.push(games[i].id);
      }
      const opponent = await db.Game.findAll({
        where: {
          id: {
            [Op.in]: gameArray,
          },
        },
        include: 'players',
      });
      console.log(opponent);
      const playerStats = player.dataValues;
      res.render('dashboard', { playerStats, games });
    } catch (err) {
      console.log(err);
    }
  };
  return {
    login, verifyLogin, dashboard,
  };
}
