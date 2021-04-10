import countValue from './countValue.js';
// import all images from imgs directory
function importAll(r) {
  const images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./imgs', false, /\.(png|jpe?g|svg)$/));

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

  // dealer hand
  for (let i = 0; i < currentGame.dealerHand.length; i += 1) {
    const dealerHand = new Image();
    if (currentGame.status === 'round over') {
      dealerCount.innerText = `Dealer's Count: ${countValue(currentGame.dealerHand)}`;
    } else if (currentGame.status === 'in-progress') {
      dealerCount.innerText = `Dealer's Count: ${currentGame.dealerHand[0].value}`;
    }
    dealerHand.classList.add('card');
    if (i === 1) {
      dealerHand.classList.add('hideDealerCard');
    }
    if (currentGame.status === 'round over') {
      dealerHand.classList.remove('hideDealerCard');
    }
    dealerHand.src = images[`${currentGame.dealerHand[i].img}`];
    dealerTable.appendChild(dealerHand);
  }

  // player 1 hand
  for (let i = 0; i < currentGame.player1Hand.length; i += 1) {
    const player1Hand = new Image();
    player1Count.innerText = `Player 1's Count: ${countValue(currentGame.player1Hand)}`;
    player1Hand.classList.add('card');
    player1Hand.src = images[`${currentGame.player1Hand[i].img}`];
    player1Table.appendChild(player1Hand);
  }

  // player 2 hand
  for (let i = 0; i < currentGame.player2Hand.length; i += 1) {
    const player2Hand = new Image();
    player2Count.innerText = `Player 2's Count: ${countValue(currentGame.player2Hand)}`;
    player2Hand.classList.add('card');
    player2Hand.src = images[`${currentGame.player2Hand[i].img}`];
    player2Hand.innerText = `${currentGame.player2Hand[i].name} of ${currentGame.player2Hand[i].suit}`;
    player2Table.appendChild(player2Hand);
  }
}
