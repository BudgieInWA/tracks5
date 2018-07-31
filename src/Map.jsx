import _ from "lodash";
import React from "react";
import { GridGenerator, Hex, HexGrid, Layout, Text } from "react-hexgrid";
import Tile from "./svg/Tile.jsx";
import Path from "./svg/Path.jsx";

import { getToolImpl } from "./tools";

import Building from "./svg/Building.jsx";

const makeHex = (str) => new Hex(...(str.split(',').map(s => parseInt(s))));

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  makeHexToolEventDelegator(eventType, arg) {
    const tool = getToolImpl(this.props.tool.name);
    return tool[eventType] && ((event) => tool[eventType].apply(this, [arg, event]));
  }

  render() {
    const { tool, terrain, tracks, buildings } = this.props;

    const hexagons = GridGenerator.spiral(Hex.origin , 4);

    return (
      <HexGrid width="100%" height="100%">
        <Layout size={{ x: 7, y: 7 }}>
          {_.map(hexagons, hex => (
            <Tile
              key={hex.toString()}
              hex={hex}

              onClick={this.makeHexToolEventDelegator('onClick', { hex })}
              // onMouseDown={this.makeHexToolEventDelegator('onMouseDown')}
              // onMouseUp={this.makeHexToolEventDelegator('onMouseUp')}
              onMouseEnter={this.makeHexToolEventDelegator('onMouseEnter', { hex })}
              onMouseLeave={this.makeHexToolEventDelegator('onMouseLeave', { hex })}

              // onDragStart={this.makeHexToolEventDelegator('onDragStart')}
              // onDragOver={this.makeHexToolEventDelegator('onDragStart')}
              // onDrop={this.makeHexToolEventDelegator('onDragOver')}
              // onDragEnd={this.makeHexToolEventDelegator('onDragEnd')}
            >
              <Text className="debug">{hex.toString()}</Text>
            </Tile>
          ))}
          {tracks && (
            <g className="tracks">
              {_.map(tracks.edges, ({ v, w }) => <Path hexes={[makeHex(v), makeHex(w)]} />)}
            </g>
          )}
          {_.map(buildings, building => <Building {...building} />) }

          <g className="tool">
            {tool.hexes.length && <Path hexes={tool.hexes} />}
          </g>

        </Layout>
      </HexGrid>
    );
  }
}