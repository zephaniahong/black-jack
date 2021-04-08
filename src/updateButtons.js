export default function updateButtons(updatedGame) {
  const readyButton = document.querySelector('#readyButton');
  const hitButton = document.querySelector('#hitButton');
  const standButton = document.querySelector('#standButton');
  const dealButton = document.querySelector('#dealButton');

  if (updatedGame.status === 'in-progress') {
    if (updatedGame.turn !== updatedGame.loggedInPlayer) {
      // disable hit and stand buttons if not the player's turn
      hitButton.disabled = true;
      standButton.disabled = true;
    }
    if (updatedGame.loggedInPlayer === updatedGame.player1Id) {
      if (updatedGame.player1Status === '21') {
        hitButton.disabled = true;
        standButton.disbaled = true;
      } else if (updatedGame.player1Status === 'BUSTED') {
        hitButton.disabled = true;
        standButton.disabled = true;
      }
    } else if (updatedGame.loggedInPlayer === updatedGame.player2Id) {
      if (updatedGame.player2Status === '21') {
        hitButton.disabled = true;
        standButton.disbaled = true;
      } else if (updatedGame.player2Status === 'BUSTED') {
        hitButton.disabled = true;
        standButton.disabled = true;
      }
    }
  } else if (updatedGame.status === 'betting in-progress') {
    if (updatedGame.loggedInPlayer === updatedGame.player1Id) {
      // disable ready buttons if player has clicked it before
      if (updatedGame.player1Status === 'ready') {
        readyButton.disabled = true;
      }
    } else if (updatedGame.loggedInPlayer === updatedGame.player2Id) {
      if (updatedGame.player2Status === 'ready') {
        readyButton.disabled = true;
      }
    }
  } else if (updatedGame.status === 'deal in-progress') {
    console.log('NICEEEEEEEEEEDANJKSNKA');
    if (updatedGame.loggedInPlayer === updatedGame.player1Id) {
      // disable ready buttons if player has clicked it before
      if (updatedGame.player1Status === 'in') {
        dealButton.disabled = true;
      }
    } else if (updatedGame.loggedInPlayer === updatedGame.player2Id) {
      if (updatedGame.player2Status === 'in') {
        dealButton.disabled = true;
      }
    }
  }
}
