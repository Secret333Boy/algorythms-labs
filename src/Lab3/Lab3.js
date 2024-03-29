'use strict';
const generateRandom = require('./generateRandom.js');
const Population = require('./Population.js');
const fs = require('fs');

const P = 250;
const initialPopulationCount = 100;
const crossbreedingOperator = 0.25;
const mutationProbability = 0.05;
const iterations = 1000;

class Lab3 {
  start() {
    const population = new Population(P, initialPopulationCount);
    fs.writeFileSync('./log.log', '');
    let bestEntityEver = null;
    for (let i = 0; i < iterations; i++) {
      if (population.entities.length === 0) break;

      const bestEntity = population.bestEntity;
      if (!bestEntityEver || bestEntity.value > bestEntityEver.value) {
        bestEntityEver = bestEntity;
      }

      const father1 = bestEntity;
      const randomIndex = Math.round(
        generateRandom(0, population.entities.length - 1)
      );
      const father2 = population.entities[randomIndex];
      population.doCrossbreeding(
        father1,
        father2,
        crossbreedingOperator,
        mutationProbability
      );
      population.killWorst();

      if (i % 20 === 0)
        fs.appendFileSync(
          './log.log',
          bestEntityEver.items
            .map(el => el.value)
            .reduce((acc, el) => acc + el) +
            ' ' +
            bestEntityEver.weight +
            ' ' +
            population.entities.length +
            '\n'
        );
    }
    console.log('Population left: ' + population.entities.length);
    console.log('Value: ' + bestEntityEver.value);
    console.log('Weight: ' + bestEntityEver.weight);
    console.log(bestEntityEver);
    process.exit();
  }
}

module.exports = Lab3;
