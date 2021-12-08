import React, { useState } from 'react';
import Card from './Card/Card.jsx';
import './TranspositionGame.scss';

export default function TranspositionGame({ cardsCount }) {
  let focusedCard1 = null;
  let focusedCard2 = null;
  const initialCardsState = [];
  for (let i = 0; i < cardsCount; i++) {
    initialCardsState.push(i + 1);
  }
  const [cardsState, setCardsState] = useState(initialCardsState);
  const swapCards = (card1, card2) => {
    const newCardsState = new Array(...cardsState);
    const i1 = cardsState.indexOf(card1);
    const i2 = cardsState.indexOf(card2);
    newCardsState[i1] = card2;
    newCardsState[i2] = card1;
    setCardsState(newCardsState);
  };
  const checkWin = () => {
    let greenWin = true;
    let redWin = true;
    let prevGreen = Infinity;
    let prevRed = Infinity;
    for (let i = 0; i < cardsCount; i++) {
      const currCard = cardsState[i];
      if (currCard % 2 === 0) {
        if (currCard > prevGreen) {
          greenWin = false;
        }
        prevGreen = currCard;
      } else {
        if (currCard > prevRed) {
          redWin = false;
        }
        prevRed = currCard;
      }
    }
    if (greenWin && redWin) {
      console.log('Draw');
    } else {
      if (redWin) {
        console.log('Red wins');
      }

      if (greenWin) {
        console.log('Green wins');
      }
    }
  };
  checkWin();
  return (
    <div className="TranspositionGame">
      {cardsState.map((i) => {
        return (
          <Card
            key={i - 1}
            pos={cardsState[i - 1]}
            onClick={(e) => {
              if (!focusedCard1) {
                focusedCard1 = e.target;
              } else {
                if (!focusedCard2) {
                  focusedCard2 = e.target;
                }
              }
              if (focusedCard1 && focusedCard2) {
                const i1 = +focusedCard1.innerText;
                const i2 = +focusedCard2.innerText;
                swapCards(i1, i2);
                focusedCard1 = null;
                focusedCard2 = null;
              }
            }}
          >
            {i}
          </Card>
        );
      })}
    </div>
  );
}
