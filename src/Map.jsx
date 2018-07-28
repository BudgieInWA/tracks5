import _ from 'lodash';
import React from 'react';
import { HexGrid, Layout, Hexagon, Path, Text, GridGenerator, Hex } from 'react-hexgrid';

import { IconSymbols, Home } from './icons.jsx';

import ActionTypes from './ActionTypes';

import Building from './Building.jsx';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  makeHexClickHandler(hex) {
    return (event) => {
      const { path, dispatch } = this.props;
      if (path.length === 0) {
        dispatch({ type: ActionTypes.path.start, hex });
      } else {
        dispatch({ type: ActionTypes.path.clear });
      }
    }
  }

  makeHexHoverHandler(hex) {
    return (event) => {
      const { dispatch } = this.props;
      dispatch({ type: ActionTypes.path.end, hex });
    }
  }

  render() {
    const { terrain, buildings, path } = this.props;

    const hexagons = GridGenerator.spiral(Hex.origin , 4);

    return (
      <HexGrid width={800} height={800}>
        <Layout size={{ x: 7, y: 7 }}>
          {_.map(hexagons, hex => (
            <Hexagon
              key={hex.toString()}
              {...hex}
              onClick={this.makeHexClickHandler(hex)}
              onMouseEnter={this.makeHexHoverHandler(hex)}
            >
              <Text className="debug">{hex.toString()}</Text>
            </Hexagon>
          ))}
          {_.map(buildings, building => <Building {...building} />) }
          {path && <Path start={path[0]} end={path[path.length - 1]} />}
        </Layout>
      </HexGrid>
    );
  }
}