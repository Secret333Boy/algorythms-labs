'use strict';

const Vertex = require('./Vertex.js');
const Matrix = require('./Matrix.js');

class Graph {
  constructor(verteces = [], matrix = new Matrix()) {
    if (verteces.some(el => !Vertex.isVertex(el))) {
      throw new TypeError('Must be instance of Vertex');
    }
    if (!Matrix.isMatrix(matrix)) {
      throw new TypeError('Must be instance of Matrix');
    }
    this.verteces = verteces;
    this.matrix = matrix;
    this.#linkVerteces(verteces, matrix);
  }

  static isGraph(obj) {
    return obj instanceof Graph;
  }

  #linkVerteces(verteces, matrix) {
    for (const i in verteces) {
      const vertex = verteces[i];
      for (const j in matrix.cols) {
        if (matrix.getElement(i, j) !== 0) {
          vertex.linkTo(verteces[j]);
        } else {
          vertex.unlinkFrom(verteces[j]);
        }
      }
    }
  }

  isConnected(v1, v2) {
    return +this.matrix.getElement(v1, v2) !== 0;
  }

  connect(v1, v2, weight = 1) {
    this.matrix.setElement(v1, v2, weight);
    this.verteces[v1].linkTo(this.verteces[v2]);
  }

  disconnect(v1, v2) {
    this.matrix.setElement(v1, v2, 0);
    this.verteces[v1].unlinkFrom(this.verteces[v2]);
  }

  insert(...vertexes) {
    for (const vertex of vertexes) {
      this.#add(vertex);
    }
  }

  remove(obj) {
    if (this.verteces.includes(obj)) {
      this.#delete(obj);
    }
  }

  subgraph(verteces = this.verteces) {
    const newVerteces = verteces.map(el => new Vertex(el.data));
    return new Graph(newVerteces, this.#matrixFromVerteces(verteces));
  }

  #matrixFromVerteces(verteces) {
    const newMatrix = new Matrix();
    for (const vertex of verteces) {
      const i = this.verteces.indexOf(vertex);
      const row = [];
      for (let j = 0; j < verteces.length; j++) {
        row.push(0);
      }
      const linkedVerteces = vertex.links.values();
      for (const linkedVertex of linkedVerteces) {
        const index = verteces.indexOf(linkedVertex);
        if (index > -1) {
          const j = this.verteces.indexOf(linkedVertex);
          row[index] = this.matrix.getElement(i, j);
        }
      }
      newMatrix.pushRow(row.map(el => el || 0));
    }
    return newMatrix;
  }

  #add(obj) {
    this.verteces.push(Vertex.isVertex(obj) ? obj : new Vertex(obj));
    this.matrix.pushRow().pushCol();
  }

  #delete(obj) {
    const index = this.verteces.indexOf(obj);
    this.verteces.splice(index, 1);
    this.matrix.removeRow(index).removeCol(index);
  }

  get isComplete() {
    for (let i = 0; i < this.verteces.length; i++) {
      for (let j = 0; j < this.verteces.length; j++) {
        if (i !== j && !this.matrix.rows[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  get connections() {
    let res = 0;
    for (let i = 0; i < this.verteces.length; i++) {
      for (let j = 0; j < this.verteces.length; j++) {
        if (this.matrix.rows[i][j]) {
          res++;
        }
      }
    }
    return res;
  }
}

module.exports = Graph;
