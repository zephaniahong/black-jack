import countValue from './countValue.js';

export default function displayCards(currentGame) {
  // clear all existing cards
  const elements = document.getElementsByClassName('card');
  while (elements.length > 0) {
    elements[0].remove();
  }

  const dealerTable = document.querySelector('#dealerTable');
  const player1Table = document.querySelector('#player1Table');
  const player2Table = document.querySelector('#player2Table');
  const dealerCount = document.querySelector('#dealerCount');
  const player1Count = document.querySelector('#player1Count');
  const player2Count = document.querySelector('#player2Count');
  const gameBanner = document.querySelector('#gameBanner');
  const player1Banner = document.querySelector('#player1Banner');
  const player2Banner = document.querySelector('#player2Banner');
  const player1Bet = document.querySelector('#player1Bet');
  const player2Bet = document.querySelector('#player2Bet');
  // update game banner
  if (currentGame.status > 0) {
    gameBanner.innerText = `Player ${currentGame.turn}'s Turn`;
  } else if (currentGame.status === 'round over') {
    gameBanner.innerText = 'Round Over';
  }

  // update player banner status
  player1Banner.innerText = `Status: ${currentGame.player1Status}`;
  player2Banner.innerText = `Status: ${currentGame.player2Status}`;

  // update bet amounts
  player1Bet.innerText = `Bet: ${currentGame.player1BetAmount}`;
  player2Bet.innerText = `Bet: ${currentGame.player2BetAmount}`;

  // dealer hand
  for (let i = 0; i < currentGame.dealerHand.length; i += 1) {
    dealerCount.innerText = countValue(currentGame.dealerHand);
    const dealerHand = document.createElement('p');
    dealerHand.classList.add('card');
    dealerHand.innerText = `${currentGame.dealerHand[i].name} of ${currentGame.dealerHand[i].suit}`;
    dealerTable.appendChild(dealerHand);
  }

  // player 1 hand
  for (let i = 0; i < currentGame.player1Hand.length; i += 1) {
    player1Count.innerText = countValue(currentGame.player1Hand);
    const player1Hand = document.createElement('p');
    player1Hand.classList.add('card');
    player1Hand.innerText = `${currentGame.player1Hand[i].name} of ${currentGame.player1Hand[i].suit}`;
    player1Table.appendChild(player1Hand);
  }

  // player 2 hand
  for (let i = 0; i < currentGame.player2Hand.length; i += 1) {
    player2Count.innerText = countValue(currentGame.player2Hand);
    const player2Hand = document.createElement('p');
    player2Hand.classList.add('card');
    player2Hand.innerText = `${currentGame.player2Hand[i].name} of ${currentGame.player2Hand[i].suit}`;
    player2Table.appendChild(player2Hand);
  }
}
