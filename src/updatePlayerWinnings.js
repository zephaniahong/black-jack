export default function updatePlayerWinnings(updatedGame) {
  const player1Winnings = document.querySelector('#player1Winnings');
  const player2Winnings = document.querySelector('#player2Winnings');

  if (updatedGame.player1Status === '21') {
    player1Winnings.innerText = `Won ${1.5 * updatedGame.player1BetAmount}`;
  } else if (updatedGame.player1Status === 'BUSTED') {
    player1Winnings.innerText = `Lost ${updatedGame.player1BetAmount}`;
  } else if (updatedGame.player1Status === 'WON') {
    player1Winnings.innerText = `Won ${updatedGame.player1BetAmount}`;
  } else if (updatedGame.player1Status === 'LOST') {
    player1Winnings.innerText = `Lost ${updatedGame.player1BetAmount}`;
  }

  if (updatedGame.player2Status === '21') {
    player2Winnings.innerText = `Won ${1.5 * updatedGame.player2BetAmount}`;
  } else if (updatedGame.player2Status === 'BUSTED') {
    player2Winnings.innerText = `Lost ${updatedGame.player2BetAmount}`;
  } else if (updatedGame.player2Status === 'WON') {
    player2Winnings.innerText = `Won ${updatedGame.player2BetAmount}`;
  } else if (updatedGame.player2Status === 'LOST') {
    player2Winnings.innerText = `Lost ${updatedGame.player2BetAmount}`;
  }
}
