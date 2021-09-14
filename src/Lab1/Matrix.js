'use strict';

class Matrix {
  constructor(arr) {
    this.arr = this.#alignRows(arr);
  }

  static isMatrix(obj) {
    return obj instanceof Matrix;
  }

  #alignRows(arr) {
    const res = [];
    const maxRowLength = Math.max(...arr.map(el => el.length));

    for (const row of arr) {
      while (row.length !== maxRowLength) {
        row.push(null);
      }
      res.push(row);
    }
    return res;
  }

  getElement(x, y) {
    return this.arr[y, x];
  }

  add(matrix) {
    if (!Matrix.isMatrix(matrix)) {
      throw new TypeError('Must be an instance of Matrix');
    }

    if (this.xLength !== matrix.xLength || this.yLength !== matrix.yLength) {
      return new Error('Imposible to add matrixes with different size');
    }
  }

  //Implement later
  mult(matrix) {
    if (!Matrix.isMatrix(matrix)) {
      throw new TypeError('Must be an instance of Matrix');
    }
    console.log('Not implemented yet');
  }

  get xLength() {
    return this.arr[0].length;
  }

  get yLength() {
    return this.arr.length;
  }
}

module.exports = Matrix;
