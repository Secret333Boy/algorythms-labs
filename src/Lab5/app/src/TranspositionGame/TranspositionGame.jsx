import React, { useState, useEffect } from 'react';
import Card from './Card/Card.jsx';
import './TranspositionGame.scss';

const swapItems = (state, item1, item2) => {
  const newCardsState = new Array(...state);
  const i1 = state.indexOf(item1);
  const i2 = state.indexOf(item2);
  newCardsState[i1] = item2;
  newCardsState[i2] = item1;
  return newCardsState;
};

const calcHeuristic = (state, red = true) => {
  let res = 0;
  const idealState = new Array(...state)
    .sort((a, b) => b - a)
    .filter((el) => (red ? el % 2 !== 0 : el % 2 === 0));
  const originalState = new Array(...state).filter((el) =>
    red ? el % 2 !== 0 : el % 2 === 0
  );
  for (let i = 0; i < idealState.length; i++) {
    if (idealState[i] === originalState[i]) res++;
  }
  return res;
};

const checkWin = (state) => {
  const greenWin = calcHeuristic(state, false) === state.length / 2;
  const redWin = calcHeuristic(state) === state.length / 2;
  if (greenWin && redWin) {
    return 'Draw';
  }
  if (redWin) {
    return 'Red wins';
  }
  if (greenWin) {
    return 'Green wins';
  }
  return false;
};

const getPossibleMove = (state, num1) => {
  const res = new Array(...state).filter((i) =>
    num1 &&
    state[Math.min(state.indexOf(num1), state.indexOf(i))] <
      state[Math.max(state.indexOf(num1), state.indexOf(i))]
      ? true
      : false
  );
  return res;
};

const minimax = (
  state,
  depth,
  alpha = -Infinity,
  beta = Infinity,
  isMaximazing = true
) => {
  if (depth === 0 || checkWin(state)) {
    return { state, value: calcHeuristic(state) - calcHeuristic(state, false) };
  }
  const possibleMoves = state
    .map((el) => ({
      a: el,
      b: getPossibleMove(state, el),
    }))
    .reduce((acc, el) =>
      Array.isArray(acc)
        ? acc.concat(el.b.map((b) => [el.a, b]))
        : el.b.map((b) => [el.a, b])
    );
  const children = possibleMoves.map(([a, b]) => {
    return swapItems(state, a, b);
  });
  if (isMaximazing) {
    let maxValue = -Infinity;
    let maxState = children[0];
    for (const child of children) {
      const { value } = minimax(child, depth - 1, alpha, beta, false);
      maxState = value > maxValue ? child : maxState;
      maxValue = Math.max(maxValue, value);
      alpha = Math.max(alpha, value);
      if (beta <= alpha) break;
    }
    return { state: maxState, value: maxValue };
  } else {
    let minValue = Infinity;
    let minState = children[0];
    for (const child of children) {
      const { value } = minimax(child, depth - 1, alpha, beta, true);
      minState = value < minValue ? child : minState;
      minValue = Math.min(minValue, value);
      alpha = Math.min(beta, value);
      if (beta <= alpha) break;
    }
    return { state: minState, value: minValue };
  }
};

export default function TranspositionGame({ cardsCount }) {
  const [winMessage, setWinMessage] = useState(false);
  const [AIturn, setAITurn] = useState(false);
  const [focusedNum1, setFocusedNum1] = useState(null);
  let focusedCard2 = null;
  const initialCardsState = [];
  for (let i = 0; i < cardsCount; i++) {
    initialCardsState.push(i + 1);
  }
  const [cardsState, setCardsState] = useState(initialCardsState);
  if (AIturn) {
    const AIMove = minimax(cardsState, 2).state;
    for (let i = 0; i < cardsState.length; i++) {
      if (cardsState[i] !== AIMove[i]) {
        console.log(`${cardsState[i]} -> ${AIMove[i]}`);
      }
    }
    setCardsState(AIMove);
    setAITurn(false);
  }
  const swapCards = (card1, card2) => {
    setCardsState(swapItems(cardsState, card1, card2));
  };
  const message = checkWin(cardsState);
  useEffect(() => {
    setWinMessage(message);
    if (message) {
      setTimeout(() => {
        setCardsState(initialCardsState);
        setAITurn(false);
      }, 2000);
    }
  }, [message, initialCardsState]);

  return (
    <div className="TranspositionGame">
      <div className="winMessage" hidden={winMessage ? false : true}>
        {winMessage}
      </div>
      {cardsState.map((i) => {
        return (
          <Card
            key={i - 1}
            pos={cardsState[i - 1]}
            focused={focusedNum1 === i ? true : false}
            possible={
              getPossibleMove(cardsState, focusedNum1).includes(i)
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
