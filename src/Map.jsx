import _ from 'lodash';
import React from 'react';
import { HexGrid, Layout, Hexagon, Path, Text, GridGenerator, Hex } from 'react-hexgrid';

import { getTool }  from './tools';

import Building from './Building.jsx';

const makeHex = (str) => new Hex(...(str.split(',').map(parseInt))); // FIXME

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  makeHexToolEventDelegator(eventType) {
    const tool = getTool(this.props.tool.name);
    return tool[eventType] && tool[eventType].bind(this);
  }

  render() {
    const { tool, terrain, tracks, buildings } = this.props;

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
          {_.map(tracks.edges, ({ v, w }) => <Path start={makeHex(v)} end={makeHex(w)} />)}
          {_.map(buildings, building => <Building {...building} />) }

          {tool.hexes.length && <Path start={tool.hexes[0]} end={tool.hexes[tool.hexes.length - 1]} />}

        </Layout>
      </HexGrid>
    );
  }
}