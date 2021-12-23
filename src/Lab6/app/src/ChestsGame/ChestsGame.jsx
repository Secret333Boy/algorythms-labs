import React, { useState } from 'react';
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
  const [deskCards, setDeckCards] = useState(
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
  console.log(deskCards);
  const [playerCards, setPlayerCards] = useState([]);
  const [AICards, setAICards] = useState([]);
  return (
    <div className="ChestsGame">
      <div className="deck">
        {deskCards.map((el, i) => (
          <Card key={i} value={el.value} suit={el.suit} />
        ))}
      </div>
    </div>
  );
}
