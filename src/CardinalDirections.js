import _ from 'lodash';
import { Hex, HexUtils } from 'react-hexgrid';

class CardinalDirection extends Hex {

  constructor(vector, bearing, name) {
    super(vector.q, vector.r, vector.s);

    this.bearing = bearing;
    this.name = name;
  }
}

const directionsByString = {};
const CardinalDirections = {
  N : new CardinalDirection(new Hex(1, -1, 0), 0, 'North'),
  NE: new CardinalDirection(new Hex(1, -1, 0), 60, 'North East'),
  SE: new CardinalDirection(new Hex(1, 0, -1), 120, 'South East'),
  S:  new CardinalDirection(new Hex(0, 1, -1), 180, 'South'),
  SW: new CardinalDirection(new Hex(-1, 1, 0), 240, 'South West'),
  NW: new CardinalDirection(new Hex(-1, 1, 0), 300, 'North East'),
};
CardinalDirections.fromString = str => str ? directionsByString[str.toString()] : str;

const directionKeys = _.keys(CardinalDirections);
const wrap = n => (n + directionKeys.length) % directionKeys.length;
_.each(directionKeys, (key, i) => {
  const thisDirection = CardinalDirections[key];

  thisDirection.left = CardinalDirections[directionKeys[wrap(i-1)]];
  thisDirection.opposite = CardinalDirections[directionKeys[wrap(i+3)]];
  thisDirection.right = CardinalDirections[directionKeys[wrap(i+1)]];

  directionsByString[thisDirection.toString()] = thisDirection;
});

export default CardinalDirections;
