import State from './State.js';
const minimax = (
  state,
  depth,
  alpha = -Infinity,
  beta = Infinity,
  isMaximazing = true
) => {
  if (depth === 0 || new State(state).checkWin()) {
    return {
      state,
      value:
        new State(state).calcHeuristic() -
        new State(state).calcHeuristic(false),
    };
  }
  const possibleMoves = state
    .map((el) => ({
      a: el,
      b: new State(state).getPossibleMove(el),
    }))
    .reduce((acc, el) =>
      Array.isArray(acc)
        ? acc.concat(el.b.map((b) => [el.a, b]))
        : el.b.map((b) => [el.a, b])
    );
  const children = possibleMoves.map(([a, b]) => {
    return new State(state).swapItems(a, b);
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
export default minimax;
