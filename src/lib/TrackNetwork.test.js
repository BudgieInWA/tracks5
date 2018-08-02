import _ from 'lodash';
import { Hex } from 'react-hexgrid';

import TrackNetwork from './TrackNetwork';

describe('API', () => {
  let network;
  beforeEach(() => {
    network = new TrackNetwork();
  });

  it('addPath', () => {
    network.addPath([Hex.origin, new Hex(1, 0, -1)]);
  });

  // it('reverse(dir)', () => {
  // });
});

describe('addPath', () => {
  // it('builds a rail between two hexes', () => {
  // })
});
