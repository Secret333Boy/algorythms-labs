import React from 'react';
import './Card.scss';

export default function Card({ value, suit }) {
  return (
    <div className="Card">
      <div
        className="front"
        value={value}
        suit={suit}
        style={{
          background: `url(./img/${value}${suit}.png)`,
        }}
      />
      <div
        className="back"
        style={{
          background: 'url(./img/back.png)',
        }}
      />
    </div>
  );
}
