import React, { useRef, useState } from 'react';
import './ChestsGame.scss';
import Card from './Card/Card.jsx';

const values = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['Diamonds', 'Hearts', 'Clubs', 'Spades'];

const shuffle = (initialState) => {
  const indexes = [];
  const res = [];
  for (let i = 0; i < initialState.length; i++) {
    indexes.push(i);
  }
  while (indexes.length !== 0) {
    const randomIndex =
      indexes[Math.round(Math.random() * (indexes.length - 1))];
    res.push(initialState[randomIndex]);
    indexes.splice(indexes.indexOf(randomIndex), 1);
  }
  return res;
};

export default function ChestsGame() {
  const [isStarted, setIsStarted] = useState(false);
  const AIHandRef = useRef();
  const deckRef = useRef();
  const playerHandRef = useRef();
  const valuesChoiceRef = useRef();
  const countChoiceRef = useRef();
  const suitChoiceRef = useRef();
  const [deckCards, setDeckCards] = useState(
    shuffle(
      values
        .map((el) => {
          return suits.map((suit) => ({
            value: el,
            suit,
          }));
        })
        .reduce((acc, el) => acc.concat(el))
    )
  );
  const [playerCards, setPlayerCards] = useState([]);
  const [AICards, setAICards] = useState([]);
  const [AITurn, setAITurn] = useState(false);

  const getPlayerCardFromDeck = (count) => {
    if (deckCards.length > 0) {
      const res = [];
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.round(Math.random() * (deckCards.length - 1));
        res.push(deckCards[randomIndex]);
      }
      setPlayerCards(playerCards.concat(res));
      const newDeck = deckCards.filter((el) => !res.includes(el));
      console.log(deckCards, newDeck);
      setDeckCards(newDeck);
    }
  };
  const getAICardFromDeck = (count) => {
    if (deckCards.length > 0) {
      const res = [];
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.round(Math.random() * (deckCards.length - 1));
        res.push(deckCards[randomIndex]);
      }
      setAICards(AICards.concat(res));
      const newDeck = deckCards.filter((el) => !res.includes(el));
      console.log(deckCards, newDeck);
      setDeckCards(newDeck);
    }
  };

  const transferCard = (card, fromAI = false) => {
    if (fromAI) {
      for (let i = 0; i < playerCards.length; i++) {
        if (
          card.value === playerCards[i].value &&
          card.suit === playerCards[i].suit
        ) {
          setAICards(AICards.concat([[playerCards[i]]]));
          playerCards.splice(i, 1);
          setPlayerCards(playerCards);
          break;
        }
      }
      return;
    }
    for (let i = 0; i < AICards.length; i++) {
      if (card.value === AICards[i].value && card.suit === AICards[i].suit) {
        setPlayerCards(playerCards.concat([AICards[i]]));
        AICards.splice(i, 1);
        setAICards(AICards);
        break;
      }
    }
  };

  if (deckCards.length === 0) {
    let AIScore = 0;
    let playerScore = 0;

    const AIMap = {};
    for (const card of AICards) {
      if (!AIMap[card.value]) {
        AIMap[card.value] = 1;
        continue;
      }
      AIMap[card.value]++;
      if (AIMap[card.value] === 4) AIScore++;
    }
    const playerMap = {};
    for (const card of playerCards) {
      if (!playerMap[card.value]) {
        playerMap[card.value] = 1;
        continue;
      }
      playerMap[card.value]++;
      if (playerMap[card.value] === 4) playerScore++;
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    if (AIScore > playerScore) {
      return <h1>AI wins!</h1>;
    }
    if (AIScore === playerScore) {
      return <h1>Draw</h1>;
    }

    return <h1>Player wins!</h1>;
  }

  if (AITurn) {
    const map = {};
    for (const card of AICards) {
      if (!map[card.value]) {
        map[card.value] = [card.suit];
      } else {
        map[card.value].push(card.suit);
      }
    }

    let max = { value: Object.keys(map)[0], suit: map[Object.keys(map)[0]] };
    for (const value in map) {
      if (map[value].length > max.suit.length)
        max = { value, suit: map[value] };
    }
    const value = max.value;
    const suit = suits.filter((el) => !max.suit.includes(el));
    const randomSuit = suit[Math.floor(Math.random() * (suit.length - 1))];
    for (let i = 0; i < playerCards.length; i++) {
      if (
        playerCards[i].value === value &&
        playerCards[i].suit === randomSuit
      ) {
        transferCard(playerCards[i], true);
        return;
      }
    }
    getAICardFromDeck(1);
    setAITurn(false);
  }

  return (
    <div className="ChestsGame">
      <div className="AIHand" ref={AIHandRef}>
        {AICards.map((el, i) => (
          <Card key={i} value={el.value} suit={el.suit} />
        ))}
      </div>
      <div
        className="deck"
        ref={deckRef}
        onClick={() => {
          if (!isStarted) {
            getPlayerCardFromDeck(4);
            getAICardFromDeck(4);
            setIsStarted(true);
            return;
          }
        }}
      >
        {deckCards.map((el, i) => (
          <Card key={i} value={el.value} suit={el.suit} />
        ))}
      </div>
      <div className="playerChoice">
        <select ref={valuesChoiceRef}>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="J">J</option>
          <option value="Q">Q</option>
          <option value="K">K</option>
          <option value="A">A</option>
        </select>
        <select ref={countChoiceRef}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <select ref={suitChoiceRef}>
          <option value="Diamonds">♦</option>
          <option value="Hearts">♥</option>
          <option value="Spades">♣</option>
          <option value="Clubs">♠</option>
        </select>
        <button
          onClick={() => {
            const value = valuesChoiceRef.current.value;
            const count = countChoiceRef.current.value;
            const suit = suitChoiceRef.current.value;
            if (!AITurn) {
              for (let i = 0; i < AICards.length; i++) {
                if (AICards[i].value === value && AICards[i].suit === suit) {
                  transferCard(AICards[i]);
                  return;
                }
              }
              setAITurn(true);
              getPlayerCardFromDeck(1);
              console.log('Nope.');
              return;
            }
          }}
        >
          Accept choice
        </button>
      </div>
      <div className="playerHand" ref={playerHandRef}>
        {playerCards.map((el, i) => (
          <Card key={i} value={el.value} suit={el.suit} />
        ))}
      </div>
    </div>
  );
}
