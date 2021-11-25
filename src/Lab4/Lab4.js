'use strict';

const Field = require('./Field.js');
const generateGraph = require('./generateGraph.js');
const Hive = require('./Hive.js');

const vertecesNum = 300;
const minPower = 2;
const maxPower = 30;
const iterations = 40;

class Lab4 {
  start() {
    const graph = generateGraph(vertecesNum, minPower, maxPower);
    const complete2subgraphs = [];
    for (let i = 0; i < vertecesNum; i++) {
      for (let j = 0; j < vertecesNum; j++) {
        const newLocation = [];
        for (let k = 0; k < vertecesNum; k++) {
          newLocation.push(0);
        }
        if (
          j > i &&
          graph.subgraph([graph.verteces[i], graph.verteces[j]]).isComplete
        ) {
          newLocation[i] = 1;
          newLocation[j] = 1;
          complete2subgraphs.push(newLocation);
        }
      }
    }

    let fields = complete2subgraphs.map(el => new Field(el));

    const hive = new Hive(graph);
    fields = hive.sendScouts(...fields);

    let maxField = fields[0];
    for (let i = 0; i < iterations; i++) {
      if (i % 20 === 0) {
        console.log(`===${i}===`);
        for (const field of fields) {
          if (field.nectar > maxField.nectar) {
            maxField = field;
          }
        }
        console.log(`Max "clicka": ${maxField.nectar}`);
      }
      fields = hive.sendWorkers(...fields);
      fields = hive.sendScouts(...fields);
    }
    console.log(`Max "clicka": ${maxField.nectar}`);
    console.log(
      graph.subgraph(
        maxField.location
          .map((el, i) => (el === 0 ? 0 : graph.verteces[i]))
          .filter(el => el !== 0)
      )
    );
  }
}

module.exports = Lab4;
