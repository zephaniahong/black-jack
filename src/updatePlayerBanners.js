export default function updatePlayerBanners(updatedGame) {
  const player1Banner = document.querySelector('#player1Banner');
  const player2Banner = document.querySelector('#player2Banner');

  player1Banner.innerText = `Status: ${updatedGame.player1Status}`;
  player2Banner.innerText = `Status: ${updatedGame.player2Status}`;

  if (updatedGame === 'betting in-progress') {
    player1Banner.innerText = `Status: ${updatedGame.player1Status}`;
    player2Banner.innerText = `Status: ${updatedGame.player2Status}`;
  }

  // update player banners depending on who clicked ready
  if (updatedGame.loggedInPlayer === updatedGame.player1Id) {
    player1Banner.innerText = `Status: ${updatedGame.player1Status}`;
  } else {
    player2Banner.innerText = `Status: ${updatedGame.player2Status}`;
  }
}
