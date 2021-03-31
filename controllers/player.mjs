import jsSHA from 'jssha';

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
      const playerStats = player.dataValues;
      res.render('dashboard', { playerStats });
    } catch (err) {
      console.log(err);
    }
  };
  return {
    login, verifyLogin, dashboard,
  };
}
