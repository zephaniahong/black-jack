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
      let value = rankCounter;
      // 1, 11, 12 ,13
      if (cardName === 1) {
        cardName = 'ace';
        value = 1;
      } else if (cardName === 11) {
        cardName = 'jack';
        value = 10;
      } else if (cardName === 12) {
        cardName = 'queen';
        value = 10;
      } else if (cardName === 13) {
        cardName = 'king';
        value = 10;
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        value,
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

export default function initGamesController(db) {
  const newGame = async (req, res) => {
    const loggedInPlayer = Number(req.cookies.playerId);
    let opponent;
    // find random opponent
    const numberOfPlayers = await db.Player.count();
    opponent = Math.floor(Math.random() * numberOfPlayers) + 1;
    if (opponent === loggedInPlayer) {
      while (opponent === loggedInPlayer) {
        opponent = Math.floor(Math.random() * numberOfPlayers) + 1;
      }
    }
    // determines who is player 1 and 2 based on who has the bigger player id
    let player1Id;
    let player2Id;
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
        player1BetAmount: 0,
        player2BetAmount: 0,
      },
      status: 'betting in-progress',
      turn: player1Id,
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
    const gameId = Number(req.params.gameId);
    const loggedInPlayer = Number(req.cookies.playerId);
    let opponent;

    // get info of game
    const game = await db.Game.findOne({
      where: {
        id: gameId,
      },
      include: 'players',
    });

    // get opponent id
    for (let i = 0; i < game.players.length; i += 1) {
      if (game.players[i].id !== loggedInPlayer) {
        opponent = game.players[i].id;
      }
    }

    // determines who is player 1 and 2 based on who has the bigger player id
    let player1Id;
    let player2Id;
    if (loggedInPlayer < opponent) {
      player1Id = loggedInPlayer;
      player2Id = opponent;
    } else {
      player1Id = opponent;
      player2Id = loggedInPlayer;
    }

    let status;
    let turn;
    if (game.turn === player1Id) {
      status = 'betting in-progress';
      turn = opponent;
    } else {
      status = 'in-progress';
      turn = player1Id;
    }

    // update logged in player's money
    // logged in player's money
    const player = await db.Player.findByPk(loggedInPlayer);
    player.money -= betAmount;
    await player.save();

    // determine who's bet amount to update
    if (loggedInPlayer === player1Id) {
      await game.update({
        gameData: {
          cardDeck: game.gameData.cardDeck,
          dealerHand: game.gameData.dealerHand,
          player1Hand: game.gameData.player1Hand,
          player2Hand: game.gameData.player2Hand,
          player1BetAmount: betAmount,
          player2BetAmount: game.gameData.player2BetAmount,
        },
        status,
        turn,
        winnerId: null,
      });
    } else {
      await game.update({
        gameData: {
          cardDeck: game.gameData.cardDeck,
          dealerHand: game.gameData.dealerHand,
          player1Hand: game.gameData.player1Hand,
          player2Hand: game.gameData.player2Hand,
          player1BetAmount: game.gameData.player1BetAmount,
          player2BetAmount: betAmount,
        },
        status,
        turn,
        winnerId: null,
      });
    }

    res.send({
      gameId: game.id,
      dealerHand: game.gameData.dealerHand,
      player1Hand: game.gameData.player1Hand,
      player2Hand: game.gameData.player2Hand,
      status: game.status,
      turn: game.turn,
      player1Id,
      player2Id,
      player1BetAmount: game.gameData.player1BetAmount,
      player2BetAmount: game.gameData.player2BetAmount,
      bank: player.money,
    });
  };

  const gameInfo = async (req, res) => {
    const { gameId } = req.params;
    const loggedInPlayer = Number(req.cookies.playerId);
    let opponent;

    // get info of game
    const game = await db.Game.findOne({
      where: {
        id: gameId,
      },
      include: 'players',
    });

    // get opponent id
    for (let i = 0; i < game.players.length; i += 1) {
      if (game.players[i].id !== loggedInPlayer) {
        opponent = game.players[i].id;
      }
    }

    // logged in player's money
    const player = await db.Player.findByPk(loggedInPlayer);

    // determines who is player 1 and 2 based on who has the bigger player id
    let player1Id;
    let player2Id;
    if (loggedInPlayer < opponent) {
      player1Id = loggedInPlayer;
      player2Id = opponent;
    } else {
      player1Id = opponent;
      player2Id = loggedInPlayer;
    }

    res.send({
      gameId: game.id,
      dealerHand: game.gameData.dealerHand,
      player1Hand: game.gameData.player1Hand,
      player2Hand: game.gameData.player2Hand,
      status: game.status,
      turn: game.turn,
      player1Id,
      player2Id,
      player1BetAmount: game.gameData.player1BetAmount,
      player2BetAmount: game.gameData.player2BetAmount,
      bank: player.money,
    });
  };

  // when player clicks on hit button
  const hit = async (req, res) => {
    const gameId = Number(req.params.gameId);
    const loggedInPlayer = Number(req.cookies.playerId);
    let opponent;

    // get info of game
    try {
      const game = await db.Game.findOne({
        where: {
          id: gameId,
        },
        include: 'players',
      });

      // get opponent id
      for (let i = 0; i < game.players.length; i += 1) {
        if (game.players[i].id !== loggedInPlayer) {
          opponent = game.players[i].id;
        }
      }
      // determines who is player 1 and 2 based on who has the bigger player id
      let player1Id;
      let player2Id;
      if (loggedInPlayer < opponent) {
        player1Id = loggedInPlayer;
        player2Id = opponent;
      } else {
        player1Id = opponent;
        player2Id = loggedInPlayer;
      }
      // only allow to hit card if its the logged in player's turn
      if (game.turn === loggedInPlayer) {
        // pop card of deck and deal to logged in player
        const newCard = game.gameData.cardDeck.pop();
        if (loggedInPlayer === player1Id) {
          game.gameData.player1Hand.push(newCard);
        } else {
          game.gameData.player2Hand.push(newCard);
        }
        const updatedGame = await db.Game.findByPk(gameId);
        await updatedGame.update({
          gameData: game.gameData,
          status: 'in-progress',
          turn: loggedInPlayer,
          winnerId: null,
        });
      }

      res.send({
        gameId: game.id,
        dealerHand: game.gameData.dealerHand,
        player1Hand: game.gameData.player1Hand,
        player2Hand: game.gameData.player2Hand,
        status: game.status,
        turn: game.turn,
        player1Id,
        player2Id,
        player1BetAmount: game.gameData.player1BetAmount,
        player2BetAmount: game.gameData.player2BetAmount,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const stand = async (req, res) => {
    const gameId = Number(req.params.gameId);
    const loggedInPlayer = Number(req.cookies.playerId);
    let opponent;

    // get info of game
    try {
      const game = await db.Game.findOne({
        where: {
          id: gameId,
        },
        include: 'players',
      });

      // get opponent id
      for (let i = 0; i < game.players.length; i += 1) {
        if (game.players[i].id !== loggedInPlayer) {
          opponent = game.players[i].id;
        }
      }
      // determines who is player 1 and 2 based on who has the bigger player id
      let player1Id;
      let player2Id;
      if (loggedInPlayer < opponent) {
        player1Id = loggedInPlayer;
        player2Id = opponent;
      } else {
        player1Id = opponent;
        player2Id = loggedInPlayer;
      }

      // only allow logged in player to click stand button
      if (game.turn === loggedInPlayer) {
        // TODO if player 2 hits stand, deal cards for dealer
        if (game.turn === player2Id) {
          const { dealerHand } = game.gameData;

          // check sum of dealer hand and deal while less than 17
          let dealerHandCount = 0;
          for (let i = 0; i < dealerHand.length; i += 1) {
            dealerHandCount += dealerHand[i].value;
          }
          while (dealerHandCount < 17) {
            const newCard = game.gameData.cardDeck.pop();
            game.gameData.dealerHand.push(newCard);
            dealerHandCount += newCard.value;
          }

          const updatedGame = await db.Game.findByPk(gameId);
          await updatedGame.update({
            gameData: game.gameData,
            status: 'round over',
            turn: 0,
            winnerId: null,
          });
          res.send({
            gameId: updatedGame.id,
            dealerHand: updatedGame.gameData.dealerHand,
            player1Hand: updatedGame.gameData.player1Hand,
            player2Hand: updatedGame.gameData.player2Hand,
            status: updatedGame.status,
            turn: updatedGame.turn,
            player1Id,
            player2Id,
            player1BetAmount: updatedGame.gameData.player1BetAmount,
            player2BetAmount: updatedGame.gameData.player2BetAmount,
          });
        } else {
          await game.update({
            gameData: game.gameData,
            status: 'in-progress',
            turn: opponent,
            winnerId: null,
          });
          res.send({
            gameId: game.id,
            dealerHand: game.gameData.dealerHand,
            player1Hand: game.gameData.player1Hand,
            player2Hand: game.gameData.player2Hand,
            status: game.status,
            turn: game.turn,
            player1Id,
            player2Id,
            player1BetAmount: game.gameData.player1BetAmount,
            player2BetAmount: game.gameData.player2BetAmount,
          });
        } }
    }
    catch (err) {
      console.log(err);
    }
  };
  return {
    newGame, ready, gameInfo, hit, stand,
  };
}
