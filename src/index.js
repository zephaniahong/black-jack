import './styles.scss';

// global variables
let currentGame;

// get game id to set as global variable
const urlPath = window.location.pathname;
const gameId = urlPath.substring(6);

// create elements for new game
const gameContainer = document.createElement('div');
gameContainer.classList.add('container');

// game banner
const gameBanner = document.createElement('div');
gameBanner.innerText = 'Place your bets';

// game table
const table = document.createElement('div');

// append global elements
document.body.appendChild(gameContainer);
gameContainer.appendChild(gameBanner);
gameContainer.appendChild(table);

// dealer tables
const dealerTable = document.createElement('div');
const dealerName = document.createElement('h3');
dealerName.innerText = 'Dealer';
const dealerCard1 = document.createElement('p');
const dealerCard2 = document.createElement('p');
dealerTable.appendChild(dealerName);
dealerTable.appendChild(dealerCard1);
dealerTable.appendChild(dealerCard2);

// player tables
const player1Table = document.createElement('div');
const player2Table = document.createElement('div');
player1Table.id = 'player1Table';
player2Table.id = 'player2Table';
const player1Card1 = document.createElement('p');
const player1Card2 = document.createElement('p');
const player2Card1 = document.createElement('p');
const player2Card2 = document.createElement('p');
player1Table.appendChild(player1Card1);
player1Table.appendChild(player1Card2);
player2Table.appendChild(player2Card1);
player2Table.appendChild(player2Card2);
table.appendChild(player1Table);
table.appendChild(player2Table);

// bet area
const betArea = document.createElement('div');
const betLabel = document.createElement('label');
betLabel.innerText = 'BET: ';
const betInput = document.createElement('input');
betInput.name = 'betInput';
betInput.type = 'number';
betInput.min = 1;
betInput.max = 100;
table.appendChild(betArea);
betArea.appendChild(betLabel);
betArea.appendChild(betInput);

// ready button
const readyButton = document.createElement('button');
readyButton.innerText = 'READY!';
table.appendChild(readyButton);

// helper function to deal cards to all players
const dealAll = () => {
  const { dealerHand } = currentGame.gameData;
  const { player1Hand } = currentGame.gameData;
  const { player2Hand } = currentGame.gameData;
  dealerCard1.innerText = `${dealerHand[0].name} of ${dealerHand[0].suit}`;
  dealerCard2.innerText = `${dealerHand[1].name} of ${dealerHand[1].suit}`;
  player1Card1.innerText = `${player1Hand[0].name} of ${player1Hand[0].suit}`;
  player1Card2.innerText = `${player1Hand[1].name} of ${player1Hand[1].suit}`;
  player2Card1.innerText = `${player2Hand[0].name} of ${player2Hand[0].suit}`;
  player2Card2.innerText = `${player2Hand[1].name} of ${player2Hand[1].suit}`;
};

// helper function to start game when both players are ready
const startGame = () => {
  table.remove();
  betArea.remove();
  readyButton.remove();
  gameBanner.innerText = `${currentGame.player1Id}'s turn`;
  // dealer table
  table.appendChild(dealerTable);
  dealerTable.appendChild(dealerName);
  table.appendChild(player1Table);
  table.appendChild(player2Table);

  // player tables
  table.appendChild(player1Table);
  table.appendChild(player2Table);

  // action table
  const actionTable = document.createElement('div');
  const betAmount = document.createElement('h3');
  betAmount.innerText = '$53';
  const hitButton = document.createElement('button');
  const standButton = document.createElement('button');
  hitButton.innerText = 'HIT';
  standButton.innerText = 'STAND';
  actionTable.appendChild(betAmount);
  actionTable.appendChild(hitButton);
  actionTable.appendChild(standButton);
  table.append(actionTable);

  // refresh button
  const refreshButton = document.createElement('button');
  refreshButton.innerText = 'Refresh';
  table.appendChild(refreshButton);

  gameContainer.appendChild(table);

  // deal out cards to all players
  dealAll();
};

// send bet amount to database when player clicks ready and update game status
readyButton.addEventListener('click', () => {
  axios.post(`/game/${gameId}/ready?betAmount=${betInput.value}`)
    .then((response) => {
      currentGame = response.data;
      if (currentGame.turn !== 0) {
        gameBanner.innerText = 'Waiting for Opponent to place bet';
      }
      else {
        startGame();
      }
    });
});
