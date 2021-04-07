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
    const playerId = Number(req.cookies.playerId);
    try {
      // get player stats
      const player = await db.Player.findOne({
        where: {
          id: playerId,
        },
        include: 'games',
      });
      // array of all game ids that logged in user is in
      const gameArray = [];
      for (let i = 0; i < player.games.length; i += 1) {
        gameArray.push(player.games[i].id);
      }
      const opponents = await db.Game.findAll({
        where: {
          id: {
            [Op.in]: gameArray,
          },
        },
        include: 'players',
      });

      // array of gameid
      const gameIdArray = [];
      // array of id of opponents
      const opponentArray = [];
      for (let i = 0; i < opponents.length; i += 1) {
        gameIdArray.push(opponents[i].id);
        for (let j = 0; j < opponents[i].players.length; j += 1) {
          if (opponents[i].players[j].id !== playerId) {
            opponentArray.push(opponents[i].players[j].id);
          }
        }
      }
      const playerStats = player.dataValues;
      res.render('dashboard', { playerStats, gameIdArray, opponentArray });
    } catch (err) {
      console.log(err);
    }
  };
  return {
    login, verifyLogin, dashboard,
  };
}
