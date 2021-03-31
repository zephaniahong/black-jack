import './styles.scss';

// create elements for new game
// game banner
const gameBanner = document.createElement('div');
gameBanner.innerText = 'Place your bets';
// game table
const table = document.createElement('div');

// append global elements
document.body.appendChild(gameBanner);
document.body.appendChild(table);
// player elements
for (let i = 0; i < 2; i += 1) {
  const playerTable = document.createElement('div');
  playerTable.id = `player${i + 1}Table`;
  const betArea = document.createElement('div');
  betArea.id = `betArea${i + 1}`;
  const betLabel = document.createElement('label');
  betLabel.innerText = 'BET: ';
  const betInput = document.createElement('input');
  betInput.name = `betInput${i + 1}`;
  const increaseBet = document.createElement('button');
  increaseBet.id = `increaseBet${i + 1}`;
  const decreaseBet = document.createElement('button');
  decreaseBet.id = `decreaseBet${i + 1}`;
  const readyButton = document.createElement('button');
  readyButton.id = `readyButton${i + 1}`;
  // append player elements
  table.appendChild(playerTable);
  playerTable.appendChild(betArea);
  betArea.appendChild(betLabel);
  betArea.appendChild(betInput);
  betArea.appendChild(increaseBet);
  betArea.appendChild(decreaseBet);
  playerTable.appendChild(readyButton);
}
