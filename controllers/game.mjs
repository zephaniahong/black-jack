import sequelizePackage from 'sequelize';

const { Op } = sequelizePackage;
/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Card Deck Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// get a random index from an array given it's size
const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
  let currentIndex = 0;

  // loop over the entire cards array
  while (currentIndex < cards.length) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = function () {
  // create the empty deck at the beginning
  const deck = [];

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  let suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    let rankCounter = 1;
    while (rankCounter <= 13) {
      let cardName = rankCounter;

      // 1, 11, 12 ,13
      if (cardName === 1) {
        cardName = 'ace';
      } else if (cardName === 11) {
        cardName = 'jack';
      } else if (cardName === 12) {
        cardName = 'queen';
      } else if (cardName === 13) {
        cardName = 'king';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      deck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};
/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Controller Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// global variables
let loggedInPlayer;
let opponent;
let player1Id;
let player2Id;
export default function initGamesController(db) {
  const newGame = async (req, res) => {
    loggedInPlayer = Number(req.cookies.playerId);
    // find random opponent
    const numberOfPlayers = await db.Player.count();
    opponent = Math.floor(Math.random() * numberOfPlayers) + 1;
    if (opponent === loggedInPlayer) {
      while (opponent === loggedInPlayer) {
        opponent = Math.floor(Math.random() * numberOfPlayers) + 1;
      }
    }
    console.log(loggedInPlayer);
    console.log(opponent);
    // determines who is player 1 and 2 based on who has the bigger player id
    if (loggedInPlayer < opponent) {
      player1Id = loggedInPlayer;
      player2Id = opponent;
    } else {
      player1Id = opponent;
      player2Id = loggedInPlayer;
    }
    const cardDeck = shuffleCards(makeDeck());
    const dealerHand = [cardDeck.pop(), cardDeck.pop()];
    const player1Hand = [cardDeck.pop(), cardDeck.pop()];
    const player2Hand = [cardDeck.pop(), cardDeck.pop()];
    const newGame = {
      gameData: {
        cardDeck,
        dealerHand,
        player1Hand,
        player2Hand,
      },
      status: 'betting in-progress',
      turn: 0,
      winnerId: null,
    };
    try {
      // get both players that are involved in the game
      const players = await db.Player.findAll({
        where: {
          [Op.or]: [{ id: Number(loggedInPlayer) }, { id: Number(opponent) }],
        },
      });
      // create a new game instance in the db
      const game = await db.Game.create(newGame);
      // add a row for each user to the join table for the associated game id
      await game.addPlayer(players[0]);
      await game.addPlayer(players[1]);
      res.redirect(`/game/${game.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const ready = async (req, res) => {
    const betAmount = Number(req.query.betAmount);
    const { gameId } = req.params;
    const { playerId } = req.cookies;
    // Update game status and bet amount
    const game = await db.Game.findOne({
      where: {
        id: gameId,
      },
      include: 'players',
    });
    let status;
    let turn;
    if (game.turn === 0) {
      status = 'betting in-progress';
      turn = opponent;
    } else if (game.turn === loggedInPlayer) {
      status = 'start game';
      turn = 0;
    }
    await game.update({
      gameData: game.gameData,
      status,
      turn,
      winnerId: null,
    });
    console.log(turn);
    res.send({
      gameId: game.id,
      gameData: game.gameData,
      status: game.status,
      turn: game.turn,
      player1Id,
      player2Id,
    });
  };

  return {
    newGame, ready,
  };
}
