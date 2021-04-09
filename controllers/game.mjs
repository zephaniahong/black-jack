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
// create an array to store all the names of the images
const nums = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
const suitsholder = ['Diamonds', 'Hearts', 'Clubs', 'Spades'];
const imgholder = [];
for (let i = 0; i < 13; i += 1) {
  imgholder.push([]);
  for (let j = 0; j < 4; j += 1) {
    imgholder[i].push(`${nums[i]}Of${suitsholder[j]}.jpg`);
  }
}

// creating a deck of cards
const makeDeck = () => {
  const newDeck = [];
  for (let i = 1; i <= 13; i += 1) {
    const suits = ['♦', '♥', '♣', '♠'];
    for (let j = 0; j < suits.length; j += 1) {
      let name = `${i}`;
      let value = i;
      if (name === '1') {
        name = 'A';
        value = 11;
      } else if (name === '11') {
        name = 'J';
        value = 10;
      } else if (name === '12') {
        name = 'Q';
        value = 10;
      } else if (name === '13') {
        name = 'K';
        value = 10;
      }

      const card = {
        value,
        suit: suits[j],
        img: imgholder[i - 1][j],
        name,
      };
      newDeck.push(card);
    }
  }
  return newDeck;
};
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

// const makeDeck = function () {
//   // create the empty deck at the beginning
//   const deck = [];

//   const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

//   let suitIndex = 0;
//   while (suitIndex < suits.length) {
//     // make a variable of the current suit
//     const currentSuit = suits[suitIndex];

//     // loop to create all cards in this suit
//     // rank 1-13
//     let rankCounter = 1;
//     while (rankCounter <= 13) {
//       let cardName = rankCounter;
//       let value = rankCounter;
//       // 1, 11, 12 ,13
//       if (cardName === 1) {
//         cardName = 'ace';
//         value = 11;
//       } else if (cardName === 11) {
//         cardName = 'jack';
//         value = 10;
//       } else if (cardName === 12) {
//         cardName = 'queen';
//         value = 10;
//       } else if (cardName === 13) {
//         cardName = 'king';
//         value = 10;
//       }

//       // make a single card object variable
//       const card = {
//         name: cardName,
//         suit: currentSuit,
//         rank: rankCounter,
//         value,
//       };

//       // add the card to the deck
//       deck.push(card);

//       rankCounter += 1;
//     }
//     suitIndex += 1;
//   }

//   return deck;
// };

function countValue(handArray) {
  let sum = 0;
  for (let i = 0; i < handArray.length; i += 1) {
    sum += handArray[i].value;
  }
  return sum;
}

function busted(handArray) {
  const handValue = countValue(handArray);
  return handValue > 21;
}

function is21(handArray) {
  const handValue = countValue(handArray);
  return handValue === 21;
}

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
    while (opponent === loggedInPlayer) {
      opponent = Math.floor(Math.random() * numberOfPlayers) + 1;
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
        player1Status: 'in',
        player2Status: 'in',
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

    const player1 = await db.Player.findByPk(player1Id);
    const player2 = await db.Player.findByPk(player2Id);

    // update player status
    if (loggedInPlayer === player1Id) {
      game.gameData.player1Status = 'ready';
    } else if (loggedInPlayer === player2Id) {
      game.gameData.player2Status = 'ready';
    }

    // update logged in player's money
    // logged in player's money
    const player = await db.Player.findByPk(loggedInPlayer);
    player.money -= betAmount;
    await player.save();

    let status;
    let turn;
    if (game.turn !== loggedInPlayer) {
      status = 'betting in-progress';
      turn = opponent;
    } else {
      // both players ready, start game
      status = 'in-progress';
      turn = player1Id;
      // check if any player has 21
      const { player1Hand } = game.gameData;
      const { player2Hand } = game.gameData;
      if (is21(player1Hand)) {
        player1.money += Math.round(2.5 * game.gameData.player1BetAmount);
        turn = player2Id;
        game.gameData.player1Status = '21';
      }
      if (is21(player2Hand)) {
        player2.money += Math.round(2.5 * game.gameData.player1BetAmount);
        turn = player1Id;
        game.gameData.player2Status = '21';
      }
    }

    if (game.gameData.player1Status === 21 && game.gameData.player2Status === 21) {
      status = 'round over';
    }
    await player1.save();
    await player2.save();
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
          player1Status: game.gameData.player1Status,
          player2Status: game.gameData.player2Status,
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
          player1Status: game.gameData.player1Status,
          player2Status: game.gameData.player2Status,
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
      opponent,
      loggedInPlayer,
      player1Status: game.gameData.player1Status,
      player2Status: game.gameData.player2Status,
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
      player1Status: game.gameData.player1Status,
      player2Status: game.gameData.player2Status,
      loggedInPlayer,
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

      const updatedGame = await db.Game.findByPk(gameId);

      // get players' info
      const player1 = await db.Player.findByPk(player1Id);
      const player2 = await db.Player.findByPk(player2Id);
      // only allow to hit card if its the logged in player's turn
      if (game.turn === loggedInPlayer) {
        // pop card of deck and deal to logged in player
        const newCard = game.gameData.cardDeck.pop();
        if (loggedInPlayer === player1Id) {
          game.gameData.player1Hand.push(newCard);
          // check if player has busted or got 21
          if (busted(game.gameData.player1Hand)) {
            game.turn = player2Id;
            game.gameData.player1Status = 'BUSTED';
          } else if (is21(game.gameData.player1Hand)) {
            game.turn = player2Id;
            player1.money += Math.round(2.5 * game.gameData.player1BetAmount);
            game.gameData.player1Status = '21';
          }
        }
        else {
          game.gameData.player2Hand.push(newCard);
          // check if player has busted or got 21
          if (busted(game.gameData.player2Hand)) {
            game.turn = 0;
            game.gameData.player2Status = 'BUSTED';
            game.status = 'round over';
          } else if (is21(game.gameData.player2Hand)) {
            game.turn = 0;
            player2.money += Math.round(2.5 * game.gameData.player1BetAmount);
            game.gameData.player2Status = '21';
            game.status = 'round over';
          }
        }
        await player1.save();
        await player2.save();
        await updatedGame.update({
          gameData: {
            cardDeck: game.gameData.cardDeck,
            dealerHand: game.gameData.dealerHand,
            player1Hand: game.gameData.player1Hand,
            player2Hand: game.gameData.player2Hand,
            player1BetAmount: game.gameData.player1BetAmount,
            player2BetAmount: game.gameData.player2BetAmount,
            player1Status: game.gameData.player1Status,
            player2Status: game.gameData.player2Status,
          },
          status: game.status,
          turn: game.turn,
          winnerId: null,
        });
      }
      const loggedInPlayerdb = await db.Player.findByPk(loggedInPlayer);

      res.send({
        gameId: game.id,
        dealerHand: game.gameData.dealerHand,
        player1Hand: game.gameData.player1Hand,
        player2Hand: game.gameData.player2Hand,
        status: game.status,
        turn: game.turn,
        bank: loggedInPlayerdb.money,
        player1Id,
        player2Id,
        player1BetAmount: game.gameData.player1BetAmount,
        player2BetAmount: game.gameData.player2BetAmount,
        player1Status: game.gameData.player1Status,
        player2Status: game.gameData.player2Status,
        loggedInPlayer,
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

      const player1 = await db.Player.findByPk(player1Id);
      const player2 = await db.Player.findByPk(player2Id);
      const loggedInPlayerdb = await db.Player.findByPk(loggedInPlayer);

      // only allow logged in player to click stand button
      if (game.turn === loggedInPlayer) {
        // TODO if player 2 hits stand, deal cards for dealer
        if (game.turn === player2Id) {
          let dealerHandCount = countValue(game.gameData.dealerHand);
          while (dealerHandCount < 17) {
            const newCard = game.gameData.cardDeck.pop();
            game.gameData.dealerHand.push(newCard);
            dealerHandCount += newCard.value;
          }
          // if dealer bust, all players whose status still ready will win money
          if (dealerHandCount > 21) {
            if (game.gameData.player1Status === 'ready') {
              game.gameData.player1Status = 'WON';
              player1.money += 2 * game.gameData.player1BetAmount;
            } else if (game.gameData.player2Status === 'ready') {
              game.gameData.player2Status = 'WON';
              player2.money += 2 * game.gameData.player2BetAmount;
            }
            // if dealer gets 21, all who haven't busted/get 21 loses money
          } else if (dealerHandCount === 21) {
            if (game.gameData.player1Status === 'ready') {
              game.gameData.player1Status = 'LOST';
            } else if (game.gameData.player2Status === 'ready') {
              game.gameData.player2Status = 'LOST';
            }
            // if dealer never bust, distribute money to those who higher than dealer
          } else if (dealerHandCount < 21) {
            if (game.gameData.player1Status === 'ready') {
              if (countValue(game.gameData.player1Hand) < dealerHandCount) {
                game.gameData.player1Status = 'LOST';
              }
              else if (countValue(game.gameData.player1Hand) > dealerHandCount) {
                game.gameData.player1Status = 'WON';
                player1.money += 2 * game.gameData.player1BetAmount;
              }
              else if (countValue(game.gameData.player1Hand) === dealerHandCount) {
                game.gameData.player1Status = 'DRAW';
                player1.money += game.gameData.player1BetAmount;
              }
            } else if (game.gameData.player2Status === 'ready') {
              if (countValue(game.gameData.player2Hand) < dealerHandCount) {
                game.gameData.player2Status = 'LOST';
              }
              else if (countValue(game.gameData.player2Hand) > dealerHandCount) {
                game.gameData.player2Status = 'WON';
                player2.money += 2 * game.gameData.player2BetAmount;
              }
              else if (countValue(game.gameData.player2Hand) === dealerHandCount) {
                game.gameData.player2Status = 'DRAW';
                player2.money += game.gameData.player2BetAmount;
              }
            }
          }

          await player1.save();
          await player2.save();

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
            bank: loggedInPlayerdb.money,
            player1BetAmount: updatedGame.gameData.player1BetAmount,
            player2BetAmount: updatedGame.gameData.player2BetAmount,
            player1Status: game.gameData.player1Status,
            player2Status: game.gameData.player2Status,
            loggedInPlayer,
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
            player1Status: game.gameData.player1Status,
            player2Status: game.gameData.player2Status,
            loggedInPlayer,
          });
        } }
    }
    catch (err) {
      console.log(err);
    }
  };

  const deal = async (req, res) => {
    const { gameId } = req.params;
    const loggedInPlayer = Number(req.cookies.playerId);
    let opponent;

    try {
    // get info of current game
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

      const loggedInPlayerdb = await db.Player.findByPk(loggedInPlayer);
      // shuffle new deck
      const cardDeck = shuffleCards(makeDeck());
      const dealerHand = [cardDeck.pop(), cardDeck.pop()];
      const player1Hand = [cardDeck.pop(), cardDeck.pop()];
      const player2Hand = [cardDeck.pop(), cardDeck.pop()];
      game.gameData.player1Status = 'deal';
      game.gameData.player2Status = 'deal';

      // update player status if they click on deal again
      if (loggedInPlayer === player1Id) {
        game.gameData.player1Status = 'in';
        if (game.turn !== loggedInPlayer) {
          game.turn = opponent;
          game.status = 'deal in-progress';
        } else {
          game.turn = 0;
          game.gameData.player2Status = 'in';
          game.status = 'betting in-progress';
        }
      } else if (loggedInPlayer === player2Id) {
        game.gameData.player2Status = 'in';
        if (game.turn !== loggedInPlayer) {
          game.turn = opponent;
          game.status = 'deal in-progress';
        } else {
          game.gameData.player1Status = 'in';
          game.turn = 0;
          game.status = 'betting in-progress';
        }
      }
      await game.update({
        gameData: {
          cardDeck,
          dealerHand,
          player1Hand,
          player2Hand,
          player1BetAmount: 0,
          player2BetAmount: 0,
          player1Status: game.gameData.player1Status,
          player2Status: game.gameData.player2Status,
        },
        status: game.status,
        turn: game.turn,
        winnerId: null,
      });
      res.send({
        gameId: game.id,
        dealerHand: game.gameData.dealerHand,
        player1Hand: game.gameData.player1Hand,
        player2Hand: game.gameData.player2Hand,
        status: game.status,
        turn: game.turn,
        bank: loggedInPlayerdb.money,
        player1Id,
        player2Id,
        player1BetAmount: game.gameData.player1BetAmount,
        player2BetAmount: game.gameData.player2BetAmount,
        player1Status: game.gameData.player1Status,
        player2Status: game.gameData.player2Status,
        loggedInPlayer,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return {
    newGame, ready, gameInfo, hit, stand, deal,
  };
}
