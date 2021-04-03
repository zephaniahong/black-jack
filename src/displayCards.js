export default function displayCards(currentGame) {
  console.log(currentGame);
  // dealer hand
  const dealerP = document.querySelectorAll('#dealerTable p');
  dealerP[0].innerText = `${currentGame.dealerHand[0].name} of ${currentGame.dealerHand[0].suit}`;
  dealerP[1].innerText = `${currentGame.dealerHand[1].name} of ${currentGame.dealerHand[1].suit}`;

  // player 1 hand
  const player1P = document.querySelectorAll('#player1Table p');
  player1P[0].innerText = `${currentGame.player1Hand[0].name} of ${currentGame.player1Hand[0].suit}`;
  player1P[1].innerText = `${currentGame.player1Hand[1].name} of ${currentGame.player1Hand[1].suit}`;

  const player2P = document.querySelectorAll('#player2Table p');
  player2P[0].innerText = `${currentGame.player2Hand[0].name} of ${currentGame.player2Hand[0].suit}`;
  player2P[1].innerText = `${currentGame.player2Hand[1].name} of ${currentGame.player2Hand[1].suit}`;
}
