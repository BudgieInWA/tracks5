// import _ from 'lodash';

import Hex from './Hex';
import CardinalDirection from './CardinalDirection';

import TrackNetwork from './TrackNetwork';

it('creates without crashing', () => {
  new TrackNetwork();
});

const shortPath = [Hex.origin, new Hex(1, 0, -1)];

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
    const options = network.optionsFrom(shortPath[0]).length;
    network.addPath(shortPath);
    expect(network.optionsFrom(shortPath[0]).length).toBe(options);
  });
});
