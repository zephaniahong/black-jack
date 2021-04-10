import axios from 'axios';
import displayCards from './displayCards.js';
import countValue from './countValue.js';
import updateGameBanner from './updateGameBanner.js';
import updateBetAmount from './updateBetAmount.js';
import updatePlayerBanners from './updatePlayerBanners.js';
import updateButtons from './updateButtons.js';
import updatePlayerWinnings from './updatePlayerWinnings.js';
import updateBankAmount from './updateBankAmount.js';

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
  gameContainer.classList.add('container-fluid');
  const mainRow = document.createElement('div');
  mainRow.classList.add('row');

  // game banner
  const gameBanner = document.createElement('div');
  gameBanner.classList.add('h1');
  gameBanner.classList.add('row');
  gameBanner.id = 'gameBanner';

  // stats column
  const statsContainer = document.createElement('div');
  statsContainer.id = 'statsContainer';
  statsContainer.classList.add('col-3');

  // game table
  const table = document.createElement('div');
  table.id = 'table';
  table.classList.add('col-9');

  // append global elements
  document.body.appendChild(gameContainer);
  document.body.appendChild(statsContainer);
  statsContainer.appendChild(gameBanner);
  gameContainer.appendChild(mainRow);
  mainRow.appendChild(statsContainer);
  mainRow.appendChild(table);

  // dealer tables
  const dealerTable = document.createElement('div');
  dealerTable.classList.add('row');
  dealerTable.classList.add('cardTable');
  dealerTable.id = 'dealerTable';
  const dealerName = document.createElement('h3');
  dealerName.innerText = 'Dealer';
  dealerTable.appendChild(dealerName);

  // dealer stats
  const dealerStats = document.createElement('div');
  dealerStats.classList.add('row');
  dealerStats.classList.add('stats');
  const dealerStatsLabel = document.createElement('h3');
  dealerStatsLabel.innerText = 'Dealer';
  const dealerCount = document.createElement('p');
  dealerCount.id = 'dealerCount';
  dealerCount.innerText = countValue(currentGame.dealerHand);
  statsContainer.appendChild(dealerStats);
  dealerStats.appendChild(dealerStatsLabel);
  dealerStats.appendChild(dealerCount);
  table.appendChild(dealerTable);

  // player tables
  const player1Table = document.createElement('div');
  const player2Table = document.createElement('div');
  player1Table.classList.add('row');
  player1Table.classList.add('cardTable');
  player2Table.classList.add('row');
  player2Table.classList.add('cardTable');
  player1Table.id = 'player1Table';
  player2Table.id = 'player2Table';
  const player1Label = document.createElement('h3');
  const player2Label = document.createElement('h3');
  player1Label.innerText = `Player ${currentGame.player1Id}`;
  player2Label.innerText = `Player ${currentGame.player2Id}`;

  // player stats
  const player1Stats = document.createElement('div');
  const player2Stats = document.createElement('div');
  player1Stats.classList.add('row');
  player2Stats.classList.add('row');
  player1Stats.classList.add('stats');
  player2Stats.classList.add('stats');
  const player1Banner = document.createElement('p');
  const player2Banner = document.createElement('p');
  player1Banner.id = 'player1Banner';
  player2Banner.id = 'player2Banner';
  player1Banner.innerText = 'Status: ';
  player2Banner.innerText = 'Status: ';
  const player1Winnings = document.createElement('p');
  const player2Winnings = document.createElement('p');
  player1Winnings.innerText = "Player 1's Winnings: ";
  player2Winnings.innerText = "Player 2's Winnings: ";
  player1Winnings.id = 'player1Winnings';
  player2Winnings.id = 'player2Winnings';
  const player1Count = document.createElement('p');
  const player2Count = document.createElement('p');
  player1Count.id = 'player1Count';
  player2Count.id = 'player2Count';
  player1Count.innerText = countValue(currentGame.player1Hand);
  player2Count.innerText = countValue(currentGame.player2Hand);
  const player1Bet = document.createElement('p');
  const player2Bet = document.createElement('p');
  player1Bet.id = 'player1Bet';
  player2Bet.id = 'player2Bet';
  const bank = document.createElement('div');
  bank.id = 'bank';
  bank.classList.add('row');

  const bankAmount = document.createElement('h3');
  bankAmount.id = 'bankAmount';
  bankAmount.innerText = currentGame.bank;
  player1Bet.innerText = `Bet: ${currentGame.player1BetAmount}`;
  player2Bet.innerText = `Bet: ${currentGame.player2BetAmount}`;
  bank.appendChild(bankAmount);

  // player 1 stats
  statsContainer.appendChild(player1Stats);
  player1Stats.appendChild(player1Banner);
  player1Stats.appendChild(player1Bet);
  player1Stats.appendChild(player1Winnings);
  player1Stats.appendChild(player1Count);
  player1Table.appendChild(player1Label);

  // player 2 stats
  statsContainer.appendChild(player2Stats);
  player2Stats.appendChild(player2Banner);
  player2Stats.appendChild(player2Bet);
  player2Stats.appendChild(player2Winnings);
  player2Stats.appendChild(player2Count);
  player2Table.appendChild(player2Label);

  table.appendChild(player1Table);
  table.appendChild(player2Table);
  table.appendChild(bank);

  // bet area
  const betArea = document.createElement('div');
  betArea.classList.add('row');
  betArea.classList.add('justify-content');
  const betLabel = document.createElement('label');
  betLabel.innerText = 'BET: ';
  const betInput = document.createElement('input');
  betInput.classList.add('col-6');
  betInput.name = 'betInput';
  betInput.type = 'number';
  betInput.min = 1;
  betInput.max = currentGame.bank;

  // new game button
  const dealButton = document.createElement('button');
  dealButton.id = 'dealButton';
  dealButton.innerText = 'Deal Again!';
  dealButton.addEventListener('click', () => {
    axios.get(`/game/${gameId}/deal`)
      .then((response) => {
        const updatedGame = response.data;
        console.log(updatedGame);
        if (updatedGame.status === 'betting in-progress') {
          createGameElements(updatedGame);
        }
        updateButtons(updatedGame);
      });
  });

  // ready button
  const readyButton = document.createElement('button');
  readyButton.id = 'readyButton';
  readyButton.innerText = 'READY!';
  readyButton.addEventListener('click', () => {
    axios.post(`/game/${gameId}/ready/?betAmount=${betInput.value}`)
      .then((response) => {
        const updatedGame = response.data;
        console.log(updatedGame);
        if (updatedGame.status === 'in-progress') {
          createGameElements(updatedGame);
        }
        // update bank
        updateBankAmount(updatedGame);
        // update game banner
        updateGameBanner(updatedGame);
        // update players' bet amounts
        updateBetAmount(updatedGame.player1BetAmount, updatedGame.player2BetAmount);
        // update player banners depending on who clicked ready
        updatePlayerBanners(updatedGame);
        // disable ready button if they clicked it once before - their status in ready in the db
        updateButtons(updatedGame);
        updatePlayerWinnings(updatedGame);
      });
  });

  // hit and stand and refresh
  const actionTable = document.createElement('div');
  actionTable.id = 'actionTable';
  actionTable.classList.add('row');
  const hitButton = document.createElement('button');
  hitButton.classList.add('col-3');
  const standButton = document.createElement('button');
  standButton.classList.add('col-3');
  hitButton.id = 'hitButton';
  standButton.id = 'standButton';
  hitButton.innerText = 'HIT';
  standButton.innerText = 'STAND';
  actionTable.appendChild(hitButton);
  actionTable.appendChild(standButton);
  const refreshButton = document.createElement('button');
  actionTable.appendChild(refreshButton);
  refreshButton.id = 'refreshButton';
  // refreshButton.classList.add('row');
  refreshButton.classList.add('col-4');
  refreshButton.innerText = 'Refresh';
  refreshButton.addEventListener('click', () => {
    axios.get(`/game/${gameId}/gameInfo`)
      .then((response) => {
        const updatedGame = response.data;
        console.log(updatedGame);
        // create game elements based on game status
        createGameElements(updatedGame);
        // player banners
        updatePlayerBanners(updatedGame);
      });
  });

  // allow player to hit cards
  hitButton.addEventListener('click', () => {
    axios.post(`/game/${gameId}/hit`)
      .then((response) => {
        const updatedGame = response.data;
        console.log(updatedGame);
        if (updatedGame.status === 'round over') {
          hitButton.remove();
          standButton.remove();
          table.appendChild(dealButton);
        }
        displayCards(updatedGame);
        // update bank banner
        updateBankAmount(updatedGame);
        // check if player has won/busted
        updateButtons(updatedGame);
        updatePlayerWinnings(updatedGame);
        updateGameBanner(updatedGame);
        updatePlayerBanners(updatedGame);
      });
  });

  // change turn to opponent
  standButton.addEventListener('click', () => {
    axios.post(`/game/${gameId}/stand`)
      .then((response) => {
        const updatedGame = response.data;
        console.log(updatedGame);
        if (updatedGame.status === 'round over') {
          hitButton.remove();
          standButton.remove();
          table.appendChild(dealButton);
          actionTable.appendChild(refreshButton);
        }
        displayCards(updatedGame);
        updateGameBanner(updatedGame);
        updateButtons(updatedGame);
        updatePlayerWinnings(updatedGame);
        updatePlayerBanners(updatedGame);
        updateBankAmount(updatedGame);
      });
  });

  // betting in progress, include bet area and ready button
  if (currentGame.status === 'betting in-progress') {
    table.appendChild(betArea);
    betArea.appendChild(bank);
    betArea.appendChild(betLabel);
    betArea.appendChild(betInput);
    table.appendChild(readyButton);
    actionTable.appendChild(refreshButton);
    updateGameBanner(currentGame);
    updatePlayerBanners(currentGame);
    updateButtons(currentGame);
    dealerCount.innerText = '';
    player1Count.innerText = '';
    player2Count.innerText = '';
  } else if (currentGame.status === 'deal in-progress') {
    table.appendChild(betArea);
    betArea.appendChild(bank);
    table.appendChild(dealButton);
    actionTable.appendChild(refreshButton);
    updateGameBanner(currentGame);
    updatePlayerBanners(currentGame);
    updateButtons(currentGame);
    dealerCount.innerText = '';
    player1Count.innerText = '';
    player2Count.innerText = '';
  } else if (currentGame.status === 'in-progress') {
    displayCards(currentGame);
    table.append(actionTable);
    actionTable.appendChild(refreshButton);
    updateGameBanner(currentGame);
    updateButtons(currentGame);
    updatePlayerWinnings(currentGame);
  } else if (currentGame.status === 'round over') {
    table.appendChild(dealButton);
    actionTable.appendChild(refreshButton);
    displayCards(currentGame);
    updatePlayerWinnings(currentGame);
    updateGameBanner(currentGame);
  }
}
