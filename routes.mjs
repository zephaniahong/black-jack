import { resolve } from 'path';
import db from './models/index.mjs';
import initGamesController from './controllers/game.mjs';
import initPlayersController from './controllers/player.mjs';

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  const PlayersController = initPlayersController(db);
  // login page
  app.get('/login', PlayersController.login);
  // verify login details are correct
  app.post('/login', PlayersController.verifyLogin);

  // dashboard
  app.get('/dashboard/:playerId', PlayersController.dashboard);

  // when player clicks on new game on the dashboard
  app.post('/newGame', GamesController.newGame);
  // special JS page. Include the webpack index.html file
  // new game
  app.get('/game/:gameId', (request, response) => {
    const { gameId } = request.params;
    response.sendFile(resolve('dist', 'main.html'));
  });

  // update db of bet amount and status when player clicks ready
  app.post('/game/:gameId/ready/', GamesController.ready);

  // send gameinfo to browser
  app.get('/game/:gameId/gameInfo', GamesController.gameInfo);

  // update db when player clicks on hit
  app.post('/game/:gameId/hit', GamesController.hit);

  // change turn when player clicks on stand
  app.post('/game/:gameId/stand', GamesController.stand);
}
