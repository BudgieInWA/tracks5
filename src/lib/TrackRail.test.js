// import _ from 'lodash';

import Hex from './Hex';
import CardinalDirection from './CardinalDirection';

import TrackNetwork from './TrackNetwork';
import TrackRail from './TrackRail';

// TODO import this:
const edge = { v: Hex.origin.toString(), w: CardinalDirection.N.toString(), name: TrackNetwork.between.hexes };
const edgeData = { [edge.v]: { direction: CardinalDirection.N.toString() }, [edge.w]: { direction: CardinalDirection.S.toString() } };

describe('API', () => {
  let rail;
  beforeEach(() => {
    rail = new TrackRail(edge, edgeData);
  });

  it('v', () => {
    expect(rail).toHaveProperty('v');
    expect(rail.v).toBeInstanceOf(Hex);
  });
  it('w', () => {
    expect(rail).toHaveProperty('w');
    expect(rail.w).toBeInstanceOf(Hex);
  });
  it('direction', () => {
    expect(rail).toHaveProperty('direction');
    expect(rail.direction).toBeInstanceOf(CardinalDirection);
  });

  // it('', () => {
  // });
});

describe('constructor', () => {
  it('selects the correct direction from an edge', () => {
    expect(new TrackRail(edge, edgeData).direction.toString()).toBe(edgeData[edge.v].direction);
  });
});

