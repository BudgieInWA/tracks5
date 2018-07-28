import _ from 'lodash';
import React from 'react';
import { HexGrid, Layout, Hexagon, Path, Text, GridGenerator, Hex } from 'react-hexgrid';

import Building from './Building.jsx';

export default class Map extends React.Component {
  static defaultProps = {
    terrain: hex => 'some terrain',
    buildings: [{hex: Hex.origin, name: 'test building'}],
    tracks: [],
  };

  render() {
    const { terrain, buildings } = this.props;

    const hexagons = GridGenerator.spiral(Hex.origin , 4);

    return (
      <HexGrid width={800} height={800}>
        <Layout size={{ x: 7, y: 7 }}>
          { _.map(hexagons, hex => <Hexagon key={hex.toString()} {...hex}><Text>{hex.toString()}</Text></Hexagon>) }
          { _.map(buildings, building => <Building {...building} />) }
          <Path start={new Hex(-1, -2, 3)} end={new Hex(0, 1, -1)} />
        </Layout>
      </HexGrid>
    );
  }
}