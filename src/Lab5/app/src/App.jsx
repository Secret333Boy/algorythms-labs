import React, { useState, useRef } from 'react';
import './App.scss';
import TranspositionGame from './TranspositionGame/TranspositionGame';
const maxCount = 20;
function App() {
  const [cardsCount, setCardsCount] = useState(null);
  const inputRef = useRef(null);
  if (!cardsCount) {
    return (
      <div className="App">
        <label htmlFor="#count">
          Cards count (between 2 and 20, should be even):
        </label>
        <input
          id="count"
          placeholder=""
          defaultValue="8"
          ref={inputRef}
        ></input>
        <button
          onClick={() => {
            const newCount = +inputRef.current?.value;
            if (newCount && newCount % 2 === 0 && newCount <= maxCount) {
              setCardsCount(newCount);
            }
          }}
        >
          Submit
        </button>
      </div>
    );
  }
  return (
    <div className="App">
      <TranspositionGame cardsCount={cardsCount} />
    </div>
  );
}

export default App;
