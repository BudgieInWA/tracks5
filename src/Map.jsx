import _ from "lodash";
import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { GridGenerator, HexGrid, Layout, Text } from "react-hexgrid";
import Hex from './lib/Hex';

import ActionTypes from './reducers/ActionTypes';
import { getToolImpl } from "./things/tools";
import { getGame } from './reducers/game';

import Building from "./svg/Building.jsx";
import TrainCar from "./svg/TrainCar.jsx";
import Tile from "./svg/Tile.jsx";
import Path from "./svg/Path.jsx";

import * as reactBuildings from './things/buildings';


class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    _.each(GridGenerator.spiral(Hex.origin , 4), hex => this.props.dispatch({
      type: ActionTypes.terrain.reveal,
      hex,
    }));
  }

  makeHexToolEventDelegator(eventType, arg) {
    const tool = getToolImpl(this.props.tool.name);
    return tool[eventType] && ((event) => tool[eventType].apply(this, [arg, event]));
  }

  isTouchable(thing) {
    const targets = getToolImpl(this.props.tool.name).touchTargets || {};
    return !!targets[thing];
  }

  render() {
    const { tool, terrain, tracks, trains, buildings } = this.props;

    return (
      <HexGrid width="100%" height="100%">
        <Layout size={{ x: 7, y: 7 }}>
          <g className={classNames('tiles', { touchable: this.isTouchable('tile') })}>
            {_.map(terrain, (tile, key) => {
              const hex = tile.hex;
              return (
                <Tile
                  className={classNames({ touchable: this.isTouchable('tile') })}
                  key={key}

                  {...tile}

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
              )
            })}
          </g>
          {tracks && (
            <g className={classNames('tracks', { touchable: this.isTouchable('track') })}>
              {_.map(tracks.edges, ({ v, w }) => <Path key={`${v} -> ${w}`} className="track" hexes={[Hex.of(v), Hex.of(w)]} />)}
            </g>
          )}
          {trains && (
            <g className={classNames('trains', { touchable: this.isTouchable('train') })}>
              {_.map(trains, (train) => <TrainCar key={train.name} {...train} />)}
            </g>
          )}
          <g className={classNames('buildings', { touchable: this.isTouchable('building') })}>
            {_.map(buildings, building => {
              const BuildingComp = reactBuildings[building.type] || Building;
              return <BuildingComp key={building.name} {...building} />;
            })}l
          </g>

          <g className="tool">
            {tool.hexes.length && <Path hexes={tool.hexes} />}
          </g>

        </Layout>
      </HexGrid>
    );
  }
}

export default connect(getGame)(Map);