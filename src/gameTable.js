import axios from 'axios';
import displayCards from './displayCards.js';
import countValue from './countValue.js';

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
  gameBanner.id = 'gameBanner';

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
  const dealerCount = document.createElement('p');
  dealerCount.id = 'dealerCount';
  dealerCount.innerText = countValue(currentGame.dealerHand);
  dealerTable.appendChild(dealerName);
  dealerTable.appendChild(dealerCount);
  table.appendChild(dealerTable);

  // player tables
  const player1Table = document.createElement('div');
  const player2Table = document.createElement('div');
  player1Table.id = 'player1Table';
  player2Table.id = 'player2Table';
  const player1Label = document.createElement('h3');
  const player2Label = document.createElement('h3');
  player1Label.innerText = `Player ${currentGame.player1Id}`;
  player2Label.innerText = `Player ${currentGame.player2Id}`;
  const player1Banner = document.createElement('p');
  const player2Banner = document.createElement('p');
  player1Banner.id = 'player1Banner';
  player2Banner.id = 'player2Banner';
  player1Banner.innerText = 'Status: ';
  player2Banner.innerText = 'Status: ';
  const player1Count = document.createElement('p');
  const player2Count = document.createElement('p');
  player1Count.id = 'player1Count';
  player2Count.id = 'player2Count';
  player1Count.innerText = countValue(currentGame.player1Hand);
  player2Count.innerText = countValue(currentGame.player2Hand);
  const player1BetArea = document.createElement('div');
  const player2BetArea = document.createElement('div');
  const player1Bet = document.createElement('p');
  const player2Bet = document.createElement('p');
  player1Bet.id = 'player1Bet';
  player2Bet.id = 'player2Bet';
  const bank = document.createElement('div');
  const bankAmount = document.createElement('h3');
  bankAmount.innerText = currentGame.bank;
  player1Bet.innerText = `Bet: ${currentGame.player1BetAmount}`;
  player2Bet.innerText = `Bet: ${currentGame.player2BetAmount}`;
  bank.appendChild(bankAmount);
  player1BetArea.appendChild(player1Bet);
  player2BetArea.appendChild(player2Bet);
  player1Table.appendChild(player1Label);
  player2Table.appendChild(player2Label);
  player1Table.appendChild(player1Banner);
  player2Table.appendChild(player2Banner);
  player1Table.appendChild(player1Count);
  player2Table.appendChild(player2Count);
  player1Table.appendChild(player1BetArea);
  player2Table.appendChild(player2BetArea);
  table.appendChild(player1Table);
  table.appendChild(player2Table);
  table.appendChild(bank);

  // bet area
  const betArea = document.createElement('div');
  const betLabel = document.createElement('label');
  betLabel.innerText = 'BET: ';
  const betInput = document.createElement('input');
  betInput.name = 'betInput';
  betInput.type = 'number';
  betInput.min = 1;
  betInput.max = currentGame.bank;

  // new game button
  const newGameButton = document.createElement('button');
  newGameButton.innerText = 'New Game!';

  // ready button
  const readyButton = document.createElement('button');
  readyButton.id = 'readyButton';
  readyButton.innerText = 'READY!';
  readyButton.addEventListener('click', () => {
    axios.post(`/game/${gameId}/ready/?betAmount=${betInput.value}`)
      .then((response) => {
        const updatedGame = response.data;
        console.log(updatedGame);
        // update bank
        bankAmount.innerText = updatedGame.bank;
        // update game banner
        gameBanner.innerText = `Player ${updatedGame.opponent}'s Turn`;

        // update players' bet amounts
        player1Bet.innerText = `Bet: ${updatedGame.player1BetAmount}`;
        player2Bet.innerText = `Bet: ${updatedGame.player2BetAmount}`;

        // update player banners depending on who clicked ready
        // disable ready button if they clicked it once before - their status in ready in the db
        if (updatedGame.loggedInPlayer === updatedGame.player1Id) {
          player1Banner.innerText = `Status: ${updatedGame.player1Status}`;
          if (updatedGame.player1Status === 'ready') {
            readyButton.disabled = true;
          }
        } else {
          player2Banner.innerText = `Status: ${updatedGame.player2Status}`;
          if (updatedGame.player2Status === 'ready') {
            readyButton.disabled = true;
          }
        }
        if (updatedGame.status === 'in-progress') {
          createGameElements(updatedGame);
        }
      });
  });

  // hit and stand and refresh
  const actionTable = document.createElement('div');
  const hitButton = document.createElement('button');
  const standButton = document.createElement('button');
  hitButton.innerText = 'HIT';
  standButton.innerText = 'STAND';
  actionTable.appendChild(hitButton);
  actionTable.appendChild(standButton);
  const refreshButton = document.createElement('button');
  refreshButton.innerText = 'Refresh';
  refreshButton.addEventListener('click', () => {
    axios.get(`/game/${gameId}/gameInfo`)
      .then((response) => {
        const updatedGame = response.data;
        console.log(updatedGame);
        // create game elements based on game status
        createGameElements(updatedGame);
        // player banners
        player1Banner.innerText = updatedGame.player1Status;
        player2Banner.innerText = updatedGame.player2Status;
      });
  });

  // allow player to hit cards
  hitButton.addEventListener('click', () => {
    axios.post(`/game/${gameId}/hit`)
      .then((response) => {
        const updatedGame = response.data;
        console.log(updatedGame);
        displayCards(updatedGame);
        // check if player has won/busted
        if ((updatedGame.loggedInPlayer === updatedGame.player1Id) && (updatedGame.player1Status === 'BUSTED')) {
          hitButton.disabled = true;
          standButton.disabled = true;
          // update game banner
          gameBanner.innerText = `Player ${updatedGame.turn}'s turn`;
        } else if ((updatedGame.loggedInPlayer === updatedGame.player1Id) && (updatedGame.player1Status === '21')) {
          hitButton.disabled = true;
          standButton.disabled = true;
          gameBanner.innerText = `Player ${updatedGame.turn}'s turn`;
        } else if ((updatedGame.loggedInPlayer === updatedGame.player2Id) && (updatedGame.player2Status === 'BUSTED')) {
          hitButton.disabled = true;
          standButton.disabled = true;
          gameBanner.innerText = `Player ${updatedGame.turn}'s turn`;
        } else if ((updatedGame.loggedInPlayer === updatedGame.player2Id) && (updatedGame.player2Status === '21')) {
          hitButton.disabled = true;
          standButton.disabled = true;
          gameBanner.innerText = `Player ${updatedGame.turn}'s turn`;
        }
        if (updatedGame.status === 'round over') {
          displayCards(updatedGame);
          hitButton.remove();
          standButton.remove();
          refreshButton.remove();
          table.appendChild(newGameButton);
        }
      });
  });

  // change turn to opponent
  standButton.addEventListener('click', () => {
    axios.post(`/game/${gameId}/stand`)
      .then((response) => {
        const updatedGame = response.data;
        displayCards(updatedGame);
        if (updatedGame.status === 'round over') {
          gameBanner.innerText = 'Round Over';
          hitButton.remove();
          standButton.remove();
          refreshButton.remove();
          table.appendChild(newGameButton);
          // find out who are the winners
          // facts:
          // all players
          const { dealerHand } = updatedGame;
          const { player1Hand } = updatedGame;
          const { player2Hand } = updatedGame;

          // distribute money
        }
      });
  });

  // betting in progress, include bet area and ready button
  if (currentGame.status === 'betting in-progress') {
    gameBanner.innerText = 'Place your bets';
    player1Banner.innerText = `Status: ${currentGame.player1Status}`;
    player2Banner.innerText = `Status: ${currentGame.player2Status}`;
    dealerCount.innerText = '';
    player1Count.innerText = '';
    player2Count.innerText = '';
    table.appendChild(betArea);
    betArea.appendChild(bank);
    betArea.appendChild(betLabel);
    betArea.appendChild(betInput);
    table.appendChild(readyButton);
    table.appendChild(refreshButton);

    if (currentGame.loggedInPlayer === currentGame.player1Id) {
      // disable ready buttons if player has clicked it before
      if (currentGame.player1Status === 'ready') {
        readyButton.disabled = true;
      }
    } else if (currentGame.loggedInPlayer === currentGame.player2Id) {
      if (currentGame.player2Status === 'ready') {
        readyButton.disabled = true;
      }
    }
  } else if (currentGame.status === 'in-progress') {
    displayCards(currentGame);
    gameBanner.innerText = `Player ${currentGame.turn}'s turn`;
    table.append(actionTable);
    table.appendChild(refreshButton);
    if (currentGame.loggedInPlayer === currentGame.player1Id) {
      // disable hit and stand buttons if player is busted or has 21
      if (currentGame.player1Status === 'BUSTED' || currentGame.player1Status === '21') {
        hitButton.disabled = true;
        standButton.disabled = true;
      }
    } else if (currentGame.loggedInPlayer === currentGame.player2Id) {
      if (currentGame.player2Status === 'BUSTED' || currentGame.player2Status === '21') {
        hitButton.disabled = true;
        standButton.disabled = true;
      }
    }
  } else if (currentGame.status === 'round over') {
    displayCards(currentGame);
    gameBanner.innerText = 'Round Over';
    table.appendChild(newGameButton);
  }
}
