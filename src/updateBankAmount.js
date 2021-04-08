export default function updateBankAmount(updatedGame) {
  const bankAmount = document.querySelector('#bankAmount');

  bankAmount.innerText = updatedGame.bank;
  if (updatedGame.loggedInPlayer === updatedGame.player1Id) {
    if (updatedGame.player1Status === '21') {
      bankAmount.innerText = updatedGame.bank;
    }
  } else if (updatedGame.loggedInPlayer === updatedGame.player2Id) {
    if (updatedGame.player2Status === '21') {
      bankAmount.innerText = updatedGame.bank;
    }
  }
}
