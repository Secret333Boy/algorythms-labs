import React from 'react';
import './App.scss';
import TranspositionGame from './TranspositionGame/TranspositionGame';

function App() {
  return (
    <div className="App">
      <TranspositionGame cardsCount="14" />
    </div>
  );
}

export default App;
