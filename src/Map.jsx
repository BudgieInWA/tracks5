import _ from 'lodash';
import React from 'react';
import { HexGrid, Layout, Hexagon, GridGenerator, Hex } from 'react-hexgrid';

import Building from './Building.jsx';

export default class Map extends React.Component {
  static defaultProps = {
    buildings: [{hex: Hex.origin, name: 'test building'}],
    terrainLookup: hex => 'some terrain',
  };

  render() {
    const { terrainLookup, buildings } = this.props;

    const hexagons = GridGenerator.spiral(Hex.origin , 4);

    return (
      <HexGrid width={800} height={800}>
        <Layout size={{ x: 7, y: 7 }}>
          { _.map(hexagons, hex => <Hexagon key={hex.toString()} {...hex} />) }
          { _.map(buildings, building => <Building {...building} />) }
        </Layout>
      </HexGrid>
    );
  }
}