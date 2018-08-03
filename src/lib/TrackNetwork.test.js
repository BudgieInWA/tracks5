// import _ from 'lodash';

import Hex from './Hex';
import CardinalDirection from './CardinalDirection';

import TrackNetwork from './TrackNetwork';
import TrackRail from './TrackRail';

it('creates without crashing', () => {
  new TrackNetwork();
});

const shortPath = [Hex.origin, CardinalDirection.N];

describe('API', () => {
  let network;
  beforeEach(() => {
    network = new TrackNetwork();
  });

  it('addPath', () => {
    network.addPath(shortPath);
  });

  it('optionsFrom(hex, direction=null)', () => {
    expect(network.optionsFrom(Hex.origin)).toBeInstanceOf(Array);
    expect(network.optionsFrom(Hex.origin, CardinalDirection.N)).toBeInstanceOf(Array);
  });

  it.skip('rails()', () => {

  })
  // it('reverse(dir)', () => {
  // });
});

describe('addPath', () => {
  let network;
  beforeEach(() => {
    network = new TrackNetwork();
  });

  it('adds an edge as detected by optionsFrom', () => {
    network.addPath(shortPath);
    expect(network.optionsFrom(shortPath[0]).length).toBe(1);
  });

  it('doesn\'t double-build rails', () => {
    network.addPath(shortPath);
    const originalOptions = network.optionsFrom(shortPath[0]);
    network.addPath(shortPath);
    expect(network.optionsFrom(shortPath[0])).toHaveLength(originalOptions.length);
  });
});

describe('optionsFrom', () => {
  let network;
  beforeEach(() => {
    network = new TrackNetwork();
  });

  it('returns a TrackRail option ', () => {
    network.addPath(shortPath);
    expect(network.optionsFrom(shortPath[0])[0]).toBeInstanceOf(TrackRail);
  });

  it('returns all directions without `direction` specified', () => {
    CardinalDirection.directions.forEach(d => network.addPath([Hex.origin, d]));
    expect(network.optionsFrom(Hex.origin)).toHaveLength(CardinalDirection.directions.length);
  });

  it('filters options in forward-ish relative to `direction`', () => {
    CardinalDirection.directions.forEach(d => network.addPath([Hex.origin, d]));
    expect(network.optionsFrom(Hex.origin, CardinalDirection.N)).toHaveLength(3);
  });

});
