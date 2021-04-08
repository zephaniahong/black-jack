export default function updateGameBanner(updatedGame) {
  const gameBanner = document.querySelector('#gameBanner');
  if (updatedGame.status === 'round over') {
    gameBanner.innerText = 'Round Over';
  } else if (updatedGame.status === 'betting in-progress') {
    gameBanner.innerText = 'Place your bets';
    if (updatedGame.player1Status === 'ready') {
      gameBanner.innerText = `Player ${updatedGame.player2Id}'s turn`;
    } else if (updatedGame.player2Status === 'ready') {
      gameBanner.innerText = `Player ${updatedGame.player1Id}'s turn`;
    }
  } else if (updatedGame.status === 'in-progress') {
    gameBanner.innerText = `Player ${updatedGame.turn}'s Turn`;
    if (updatedGame.loggedInPlayer === updatedGame.player1Id) {
      if (updatedGame.player1Status === '21') {
        gameBanner.innerText = `Player ${updatedGame.turn}'s turn`;
      } else if (updatedGame.player1Status === 'BUSTED') {
        gameBanner.innerText = `Player ${updatedGame.turn}'s turn`;
      }
    } else if (updatedGame.loggedInPlayer === updatedGame.player2Id) {
      if (updatedGame.player2Status === '21') {
        gameBanner.innerText = `Player ${updatedGame.turn}'s turn`;
      } else if (updatedGame.player2Status === 'BUSTED') {
        gameBanner.innerText = `Player ${updatedGame.turn}'s turn`;
      }
    }
  }
}
