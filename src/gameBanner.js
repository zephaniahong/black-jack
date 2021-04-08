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
