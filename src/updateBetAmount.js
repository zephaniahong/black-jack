export default function updateBetAmount(player1 = 0, player2 = 0) {
  const player1Bet = document.querySelector('#player1Bet');
  const player2Bet = document.querySelector('#player2Bet');
  player1Bet.innerText = `Bet: ${player1}`;
  player2Bet.innerText = `Bet: ${player2}`;
}
