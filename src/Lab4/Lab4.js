'use strict';

const Field = require('./Field.js');
const generateGraph = require('./generateGraph.js');
const Hive = require('./Hive.js');
const fs = require('fs');

const vertecesNum = 30;
const minPower = 2;
const maxPower = 30;
const iterations = 100;
const beesCount = [100];

class Lab4 {
  start() {
    fs.writeFileSync('log.log', '');
    const graph = generateGraph(vertecesNum, minPower, maxPower);
    for (let n = 0; n < beesCount.length; n++) {
      console.log(`Test ${n + 1}: ${beesCount[n]} bees`);
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
        }
        fields = hive.sendWorkers(...fields);
        fields = hive.sendScouts(...fields);
      }
      for (const field of fields) {
        if (field.nectar > maxField.nectar) {
          maxField = field;
        }
      }

      console.log(`Max "clicka": ${maxField.nectar}`);
      console.log(
        graph.subgraph(
          maxField.location
            .map((el, i) => (el === 0 ? 0 : graph.verteces[i]))
            .filter(el => el !== 0)
        )
      );
      fs.appendFileSync(
        'log.log',
        String(n) + ' ' + String(maxField.nectar) + '\n'
      );
    }
  }
}

module.exports = Lab4;
