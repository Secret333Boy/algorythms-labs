import React from 'react';
import './Card.scss';

export default function Card({ children, pos, ...rest }) {
  return (
    <div className="Card" {...rest}>
      <h1 className={children % 2 === 0 ? 'green' : 'red'}>{children}</h1>
    </div>
  );
}
