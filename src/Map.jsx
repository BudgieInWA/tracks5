import _ from 'lodash';
import React from 'react';
import { HexGrid, Layout, Hexagon, Path, Text, GridGenerator, Hex } from 'react-hexgrid';

import ActionTypes from './ActionTypes';

import { getTool }  from './tools';

import Building from './Building.jsx';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  makeHexToolEventDelegator(eventType) {
    const tool = getTool(this.props.toolName);
    return tool[eventType] && tool[eventType].bind(this);
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

              onClick={this.makeHexToolEventDelegator('onClick')}
              onMouseDown={this.makeHexToolEventDelegator('onMouseDown')}
              onMouseUp={this.makeHexToolEventDelegator('onMouseUp')}

              onMouseEnter={this.makeHexToolEventDelegator('onMouseEnter')}
              onMouseLeave={this.makeHexToolEventDelegator('onMouseLeave')}

              onDragStart={this.makeHexToolEventDelegator('onDragStart')}
              onDragOver={this.makeHexToolEventDelegator('onDragStart')}
              onDrop={this.makeHexToolEventDelegator('onDragOver')}
              onDragEnd={this.makeHexToolEventDelegator('onDragEnd')}
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