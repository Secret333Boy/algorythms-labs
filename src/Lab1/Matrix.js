'use strict';

class Matrix {
  constructor(arr = []) {
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
    return this.arr[y][x];
  }

  setElement(x, y, data) {
    this.arr[y][x] = data;
    return this;
  }

  pushRow(row = []) {
    this.arr.push(row);
    this.arr = this.#alignRows(this.arr);
    return this;
  }

  pushCol(col = []) {
    for (const i in this.arr) {
      this.arr[i].push(col[i] || null);
    }
    return this;
  }

  find(item) {
    for (const i in this.arr) {
      for (const j in this.arr[i]) {
        if (this.arr[i][j] === item) return { x: i, y: j };
      }
    }
    return false;
  }

  add(matrix) {
    if (!Matrix.isMatrix(matrix)) {
      throw new TypeError('Must be an instance of Matrix');
    }

    if (this.xLength !== matrix.xLength || this.yLength !== matrix.yLength) {
      throw new Error('Impossible to add matrixes with different sizes');
    }

    for (const i in this.arr) {
      for (const j in this.arr[i]) {
        this.arr[i][j] += matrix.arr[i][j];
      }
    }
    return this;
  }

  mult(matrix) {
    if (!Matrix.isMatrix(matrix)) {
      throw new TypeError('Must be an instance of Matrix');
    }

    if (this.xLength !== matrix.yLength || this.yLength !== matrix.xLength) {
      throw new Error(
        'Impossible to multiply matrixes with unappropriate sizes'
      );
    }

    for (const i in this.arr) {
      for (const j in this.arr[i]) {
        this.arr[i][j] = this.arr[i][0] * matrix.arr[0][j];
        for (const k in this.xLength) {
          this.arr[i][j] += this.arr[i][k] * matrix.arr[k][j];
        }
      }
    }

    return this;
  }

  transpone() {
    const res = [];
    for (const j in this.arr) {
      res.push([]);
      for (const i in this.arr[j]) {
        res[j][i] = this.arr[i][j];
      }
    }
    return new Matrix(res);
  }

  get xLength() {
    return this.arr[0].length;
  }

  get yLength() {
    return this.arr.length;
  }

  get rows() {
    return this.arr;
  }

  get cols() {
    return this.transpone().arr;
  }

  set cols(arr) {
    this.arr = new Matrix(arr).transpone().arr;
  }

  set rows(arr) {
    this.arr = arr;
  }
}

module.exports = Matrix;
