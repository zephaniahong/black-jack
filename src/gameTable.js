import axios from 'axios';
import displayCards from './displayCards.js';

// get game id to set as global variable
const urlPath = window.location.pathname;
const gameId = urlPath.substring(6);

export default function createGameElements(currentGame) {
  // clear all elements
  const container = document.querySelector('#gameContainer');
  if (container !== null) {
    container.remove();
  }

  // create elements for new game
  const gameContainer = document.createElement('div');
  gameContainer.id = 'gameContainer';
  gameContainer.classList.add('container');

  // game banner
  const gameBanner = document.createElement('div');

  // game table
  const table = document.createElement('div');

  // append global elements
  document.body.appendChild(gameContainer);
  gameContainer.appendChild(gameBanner);
  gameContainer.appendChild(table);

  // dealer tables
  const dealerTable = document.createElement('div');
  dealerTable.id = 'dealerTable';
  const dealerName = document.createElement('h3');
  dealerName.innerText = 'Dealer';
  dealerTable.appendChild(dealerName);
  table.appendChild(dealerTable);

  // player tables
  const player1Table = document.createElement('div');
  const player2Table = document.createElement('div');
  player1Table.id = 'player1Table';
  player2Table.id = 'player2Table';
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
  // ready button
  const readyButton = document.createElement('button');
  readyButton.id = 'readyButton';
  readyButton.innerText = 'READY!';
  readyButton.addEventListener('click', () => {
    readyButton.disabled = true;
    axios.post(`/game/${gameId}/ready/?betAmount=${betInput.value}`)
      .then((response) => {
        const updatedGame = response.data;
        if (updatedGame.status === 'in-progress') {
          createGameElements(updatedGame);
        }
      });
  });

  // hit and stand and refresh
  const actionTable = document.createElement('div');
  const betAmount = document.createElement('h3');
  betAmount.innerText = '$53';
  const hitButton = document.createElement('button');
  const standButton = document.createElement('button');
  hitButton.innerText = 'HIT';
  standButton.innerText = 'STAND';
  hitButton.addEventListener('click', () => {
    axios.post(`/game/${gameId}/hit`)
      .then((response) => {
        const updatedGame = response.data;
        displayCards(updatedGame);
        console.log(updatedGame);
      });
  });

  actionTable.appendChild(betAmount);
  actionTable.appendChild(hitButton);
  actionTable.appendChild(standButton);
  const refreshButton = document.createElement('button');
  refreshButton.innerText = 'Refresh';

  // betting in progress, include bet area and ready button
  if (currentGame.status === 'betting in-progress') {
    gameBanner.innerText = 'Place your bets';
    table.appendChild(betArea);
    betArea.appendChild(betLabel);
    betArea.appendChild(betInput);
    table.appendChild(readyButton);
  } else if (currentGame.status === 'in-progress') {
    // TODO: display cards
    displayCards(currentGame);
    if (currentGame.turn === 0 || currentGame.turn === 1) {
      gameBanner.innerText = `${currentGame.player1Id}'s turn`;
    } else {
      gameBanner.innerText = `${currentGame.player2Id}'s turn`;
    }
    table.append(actionTable);
    table.appendChild(refreshButton);
  }
}
