import _ from 'lodash';

import Hex from './Hex';

const directionsByString = {};
let getConstructorPermission = () => undefined;
export class CardinalDirection extends Hex {
  /**
   *
   * @param {string|Hex|{q: number, r: number, s: number}} vector -
   * @param {number} bearing - The bearing of the vector measured as the number of degrees from North, Eastward. Thanks for doing maths for me.
   * @param {String} name - A name for the humans.
   */
  constructor(vector, bearing, name) {
    getConstructorPermission();
    super(vector.q, vector.r, vector.s);

    this.bearing = bearing;
    this.name = name;
  }

  static of(vectorLike) {
    if (!vectorLike) return null;
    if (vectorLike instanceof CardinalDirection) return vectorLike;
    const hex = Hex.of(vectorLike);
    return directionsByString[hex.toString()];
  }

  static reverse(directionLike) {
    if (directionLike instanceof CardinalDirection) return directionLike.opposite;

    const reverseDirection = CardinalDirection.of(directionLike).opposite;
    return _.isString(directionLike) ? reverseDirection.toString() : reverseDirection;
  }
}

// These are all of the cardinal directions.
const directions = {
  N: new CardinalDirection(new Hex(0, -1, +1), 0, 'North'),
  NE: new CardinalDirection(new Hex(+1, -1, 0), 60, 'North East'),
  SE: new CardinalDirection(new Hex(+1, 0, -1), 120, 'South East'),
  S: new CardinalDirection(new Hex(0, +1, -1), 180, 'South'),
  SW: new CardinalDirection(new Hex(-1, +1, 0), 240, 'South West'),
  NW: new CardinalDirection(new Hex(-1, 0, +1), 300, 'North West'),
};
// We do a bunch of pre-calculations to make this concept cheap.
const directionKeys = _.keys(directions);
const wrap = (n) => (n + directionKeys.length) % directionKeys.length;
_.each(directionKeys, (key, i) => {
  const thisDirection = directions[key];
  directionsByString[thisDirection.toString()] = thisDirection;
  thisDirection.left = directions[directionKeys[wrap(i - 1)]];
  thisDirection.right = directions[directionKeys[wrap(i + 1)]];
  thisDirection.opposite = directions[directionKeys[wrap(i + 3)]];
});
_.each(directions, (d) => Object.freeze(d));

_.assign(CardinalDirection, { ...directions, directions: _.values(directions) });

getConstructorPermission = () => console.warn("I don't recommend using this anymore.");

export default CardinalDirection;
