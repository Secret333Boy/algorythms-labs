import React from 'react';
import './Card.scss';

export default function Card({
  children,
  pos,
  focused,
  possible,
  prevswap,
  ...rest
}) {
  return (
    <div
      className={
        'Card' +
        (focused ? ' focused' : '') +
        (possible ? ' possible' : '') +
        (prevswap ? ' prevswap' : '')
      }
      {...rest}
    >
      <h1 className={children % 2 === 0 ? 'green' : 'red'}>{children}</h1>
    </div>
  );
}
