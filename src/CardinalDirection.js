import _ from 'lodash';
import { Hex, HexUtils } from 'react-hexgrid';

const makeHex = (str) => str ? new Hex(...(str.split(',').map(s => parseInt(s)))) : str;

const directionsByString = {};
export class CardinalDirection extends Hex {
  constructor(vector, bearing, name) {
    super(vector.q, vector.r, vector.s);

    this.bearing = bearing;
    this.name = name;
  }

  static of(vectorLike) {
    if (!vectorLike) return;
    if (_.isString(vectorLike)) return directionsByString[vectorLike];
    if (vectorLike instanceof Hex) return directionsByString[vectorLike.toString()];
    // TODO
  }

  static reverse(directionLike) {
    if (directionLike instanceof CardinalDirection) return directionLike.opposite;

    const reverseDirection = CardinalDirection.of(directionLike).opposite;
    return _.isString(directionLike) ? reverseDirection.toString() : reverseDirection;
  }
}

_.assign(CardinalDirection, {
  N : new CardinalDirection(new Hex(1, -1, 0), 0, 'North'),
  NE: new CardinalDirection(new Hex(1, -1, 0), 60, 'North East'),
  SE: new CardinalDirection(new Hex(1, 0, -1), 120, 'South East'),
  S:  new CardinalDirection(new Hex(0, 1, -1), 180, 'South'),
  SW: new CardinalDirection(new Hex(-1, 1, 0), 240, 'South West'),
  NW: new CardinalDirection(new Hex(-1, 1, 0), 300, 'North East'),
});

const directionKeys = _.keys(CardinalDirection);
const wrap = n => (n + directionKeys.length) % directionKeys.length;
_.each(directionKeys, (key, i) => {
  const thisDirection = CardinalDirection[key];

  thisDirection.left = CardinalDirection[directionKeys[wrap(i-1)]];
  thisDirection.opposite = CardinalDirection[directionKeys[wrap(i+3)]];
  thisDirection.right = CardinalDirection[directionKeys[wrap(i+1)]];

  directionsByString[thisDirection.toString()] = thisDirection;
});

export default CardinalDirection;
