import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from './Card/Card.jsx';
import './TranspositionGame.scss';
import State from './State.js';
import minimax from './minimax.js';

export default function TranspositionGame({ cardsCount }) {
  const [winMessage, setWinMessage] = useState(false);
  const [AIturn, setAITurn] = useState(false);
  const [focusedNum1, setFocusedNum1] = useState(null);
  const [prevSwap, setPrevSwap] = useState([]);
  const difficultySelectRef = useRef();
  const difficulty =
    difficultySelectRef.current?.options.selectedIndex + 1 || 1;
  let focusedCard2 = null;
  const initialCardsState = useMemo(() => {
    const initialCardsState = [];
    for (let i = 0; i < cardsCount; i++) {
      initialCardsState.push(i + 1);
    }
    return initialCardsState;
  }, [cardsCount]);
  const [cardsState, setCardsState] = useState(initialCardsState);
  if (AIturn) {
    const AIMove = minimax(cardsState, difficulty).state;
    for (let i = 0; i < cardsState.length; i++) {
      if (cardsState[i] !== AIMove[i]) {
        setPrevSwap([cardsState[i], AIMove[i]]);
        console.log(`${cardsState[i]} -> ${AIMove[i]}`);
      }
    }
    setCardsState(AIMove);
    setAITurn(false);
  }
  const swapCards = (card1, card2) => {
    setCardsState(new State(cardsState).swapItems(card1, card2));
  };
  let message = new State(cardsState).checkWin();
  useEffect(() => {
    setWinMessage(message);
    if (message) {
      setTimeout(() => {
        setCardsState(initialCardsState);
        setPrevSwap([]);
        setAITurn(false);
      }, 10000);
    }
  }, [message, initialCardsState]);

  return (
    <div className="TranspositionGame">
      <div className="winMessage" hidden={winMessage ? false : true}>
        {winMessage}
      </div>
      <select
        name="difficuly"
        id="difficulty"
        ref={difficultySelectRef}
        defaultValue="medium"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      {cardsState.map((i) => {
        return (
          <Card
            key={i - 1}
            pos={cardsState[i - 1]}
            focused={focusedNum1 === i ? true : false}
            prevswap={prevSwap.includes(i) ? true : false}
            possible={
              new State(cardsState).getPossibleMove(focusedNum1).includes(i)
                ? true
                : false
            }
            onClick={(e) => {
              if (AIturn) {
                return;
              }
              if (!focusedNum1) {
                setFocusedNum1(+e.target.innerText);
                return;
              }
              if (focusedNum1 === +e.target.innerText) {
                setFocusedNum1(null);
                return;
              }
              if (!focusedCard2) {
                const card1 = focusedNum1;
                const card2 = +e.target.innerText;
                const i1 = cardsState.indexOf(card1);
                const i2 = cardsState.indexOf(card2);
                const leftCard = cardsState[Math.min(i1, i2)];
                const rightCard = cardsState[Math.max(i1, i2)];
                if (rightCard > leftCard) {
                  focusedCard2 = e.target;
                } else {
                  return;
                }
              }

              const card1 = focusedNum1;
              const card2 = +focusedCard2.innerText;
              swapCards(card1, card2);
              message = new State(cardsState).checkWin();
              setPrevSwap([card1, card2]);
              setFocusedNum1(null);
              setAITurn(true);
              focusedCard2 = null;
            }}
          >
            {i}
          </Card>
        );
      })}
    </div>
  );
}
