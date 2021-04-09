import './styles.scss';
import axios from 'axios';
import createGameElements from './gameTable.js';
import aceOfClubs from './imgs/aceOfClubs.jpg';

const card = new Image();
card.src = aceOfClubs;
document.body.appendChild(card);
// global variables
let currentGame;

// get game id to set as global variable
const urlPath = window.location.pathname;
const gameId = urlPath.substring(6);

axios.get(`/game/${gameId}/gameInfo`)
  .then((response) => {
    currentGame = response.data;
    // create game elements based on game status
    createGameElements(currentGame);
  });
