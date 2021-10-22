'use strict';
const BTree = require('./BTree.js');
const fs = require('fs');

const t = 50;

class DB {
  #btree = new BTree(t);
  path = null;
  autoKey = 0;
  constructor(...data) {
    for (const item of data) {
      this.insert(this.autoKey, item);
      this.autoKey++;
    }
  }

  find(key) {
    return this.#btree.find(key).data;
  }

  insert(data = null, key = this.autoKey) {
    // console.log(key);
    if (this.#btree.find(key)) {
      if (key === this.autoKey) {
        this.autoKey++;
        return this.insert(data);
      } else {
        throw new Error('This key already exists in the db');
      }
    }

    this.#btree.insert(key, data);
    if (key === this.autoKey) this.autoKey++;
    return this;
  }

  remove(key) {
    if (!this.#btree.find(key)) throw new Error('This key is not in the db');
    this.#btree.remove(key);
    return this;
  }

  update(key, data) {
    const bnode = this.#btree.find(key);
    if (!bnode) throw new Error('This key is not in the db');
    bnode.data = data;
    return this;
  }

  loadFromFile(path = this.path) {
    this.#btree = new BTree(t);

    try {
      const file = fs.readFileSync(__dirname + path, { encoding: 'utf-8' });
      const lines = file.split('\n');

      for (const line of lines) {
        this.insert(line);
      }
    } catch {
      fs.writeFileSync(__dirname + path, '');
    }

    this.path = path;
  }

  saveToFile(path = this.path) {
    fs.writeFile(__dirname + path, this.string, err => {
      if (err) throw new Error('Error while saving to file: ' + err);
      console.log('File written successfully');
      this.path = path;
    });
  }

  get string() {
    const res = [];
    for (let i = 0; i < this.autoKey; i++) {
      const data = this.find(i);
      if (!data) continue;
      res.push(data);
    }
    return res.join('\n');
  }
}

module.exports = DB;
