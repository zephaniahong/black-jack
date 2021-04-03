export default function displayCards(currentGame) {
  // clear all existing cards
  const elements = document.getElementsByClassName('card');
  while (elements.length > 0) {
    elements[0].remove();
  }

  // dealer hand
  const dealerTable = document.querySelector('#dealerTable');
  const player1Table = document.querySelector('#player1Table');
  const player2Table = document.querySelector('#player2Table');

  // dealer hand
  for (let i = 0; i < currentGame.dealerHand.length; i += 1) {
    const dealerHand = document.createElement('p');
    dealerHand.classList.add('card');
    dealerHand.innerText = `${currentGame.dealerHand[i].name} of ${currentGame.dealerHand[i].suit}`;
    dealerTable.appendChild(dealerHand);
  }

  // player 1 hand
  for (let i = 0; i < currentGame.player1Hand.length; i += 1) {
    const player1Hand = document.createElement('p');
    player1Hand.classList.add('card');
    player1Hand.innerText = `${currentGame.player1Hand[i].name} of ${currentGame.player1Hand[i].suit}`;
    player1Table.appendChild(player1Hand);
  }

  // player 2 hand
  for (let i = 0; i < currentGame.player2Hand.length; i += 1) {
    const player2Hand = document.createElement('p');
    player2Hand.classList.add('card');
    player2Hand.innerText = `${currentGame.player2Hand[i].name} of ${currentGame.player2Hand[i].suit}`;
    player2Table.appendChild(player2Hand);
  }
}
