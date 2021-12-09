export default class State {
  constructor(arr) {
    this.arr = arr;
  }
  swapItems(item1, item2) {
    const newCardsState = new Array(...this.arr);
    const i1 = this.arr.indexOf(item1);
    const i2 = this.arr.indexOf(item2);
    newCardsState[i1] = item2;
    newCardsState[i2] = item1;
    return newCardsState;
  }
  calcHeuristic(red = true) {
    let res = 0;
    const idealState = new Array(...this.arr)
      .sort((a, b) => b - a)
      .filter((el) => (red ? el % 2 !== 0 : el % 2 === 0));
    const originalState = new Array(...this.arr).filter((el) =>
      red ? el % 2 !== 0 : el % 2 === 0
    );
    for (let i = 0; i < idealState.length; i++) {
      if (idealState[i] === originalState[i]) res++;
    }
    return res;
  }
  checkWin() {
    const greenWin = this.calcHeuristic(false) === this.arr.length / 2;
    const redWin = this.calcHeuristic() === this.arr.length / 2;
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
  }
  getPossibleMove = (num1) => {
    const res = new Array(...this.arr).filter((i) =>
      num1 &&
      this.arr[Math.min(this.arr.indexOf(num1), this.arr.indexOf(i))] <
        this.arr[Math.max(this.arr.indexOf(num1), this.arr.indexOf(i))]
        ? true
        : false
    );
    return res;
  };
}
