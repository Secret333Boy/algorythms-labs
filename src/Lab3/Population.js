'use strict';

const generateRandom = require('./generateRandom.js');
const Entity = require('./Entity.js');
const Item = require('./Item.js');

const itemsCount = 100;
const weight = { min: 1, max: 25 };
const value = { min: 2, max: 30 };

class Population {
  #mapping = [];
  constructor(maxWeight, initialCount) {
    for (let i = 0; i < itemsCount; i++) {
      this.#mapping.push(
        new Item(
          Math.round(generateRandom(weight.min, weight.max)),
          Math.round(generateRandom(value.min, value.max))
        )
      );
    }

    this.maxWeight = maxWeight;
    this.entities = [];
    for (let i = 0; i < initialCount; i++) {
      const genes = [];
      for (let j = 0; j < initialCount; j++) {
        genes.push(i === j ? 1 : 0);
      }
      this.entities.push(new Entity(genes, this.#getItems(genes)));
    }
  }

  #getItems(genes) {
    return genes
      .map((el, i) => (el === 1 ? this.#mapping[i] : null))
      .filter(el => el !== null);
  }

  #useImprovementOperator(genes) {
    const lightWeightItemToAdd = genes
      .map((el, i) => (el === 0 ? this.#mapping[i] : null))
      .filter(el => el !== null)
      .reduce((acc, el) => (acc.weight < el.weight ? acc : el));
    genes[this.#mapping.indexOf(lightWeightItemToAdd)] = 1;
    if (new Entity(genes, this.#getItems(genes)).weight > this.maxWeight) {
      return false;
    }
    return genes;
  }

  doCrossbreeding(
    father1,
    father2,
    crossbreedingOperator,
    mutationProbability = 0
  ) {
    const crossbreedingSize = itemsCount * crossbreedingOperator;
    const crossbreedingPieces = 1 / crossbreedingOperator;

    const genes1 = new Array(...father1.genes);
    const genes2 = new Array(...father2.genes);

    let newGenes = [];
    let flag = false;
    let offset = 0;
    for (let i = 0; i < crossbreedingPieces; i++) {
      const gene = flag ? genes2 : genes1;
      newGenes.push(...gene.slice(offset, offset + crossbreedingSize));
      offset += crossbreedingSize;
      flag = !flag;
    }

    const possibleGenes = this.#useImprovementOperator(newGenes);

    if (possibleGenes) {
      newGenes = possibleGenes;
    }

    if (Math.random() < mutationProbability) {
      const i = Math.round(generateRandom(0, itemsCount - 1));
      const j = Math.round(generateRandom(0, itemsCount - 1));

      const buf = newGenes[i];
      newGenes[i] = newGenes[j];
      newGenes[j] = buf;
    }

    const newEntity = new Entity(newGenes, this.#getItems(newGenes));
    if (newEntity.weight > this.maxWeight) {
      return false;
    }

    this.entities.push(newEntity);
    return newEntity;
  }

  killWorst() {
    this.entities.splice(this.entities.indexOf(this.worstEntity), 1);
  }

  get bestEntity() {
    return this.entities.reduce((acc, el) => (el.value > acc.value ? el : acc));
  }

  get worstEntity() {
    return this.entities.reduce((acc, el) => (el.value < acc.value ? el : acc));
  }
}

module.exports = Population;
