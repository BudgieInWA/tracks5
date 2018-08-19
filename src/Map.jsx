import _ from "lodash";
import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { HexGrid, Layout, Text } from "react-hexgrid";
import Hex from './lib/Hex';

import ActionTypes from './reducers/ActionTypes';
import { getToolImpl } from "./things/tools";
import { getGame } from './reducers/game';
import { getTool } from './reducers/tool';
import { getView } from './reducers/appReducer';

import Building from "./svg/Building.jsx";
import TrainCar from "./svg/TrainCar.jsx";
import Tile from "./svg/Tile.jsx";
import Path from "./svg/Path.jsx";

import * as reactBuildings from './things/buildings';



class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewOffset: { x: 0, y: 0 },
    };

    let lastFrameTime = null;
    const stepFrame = (frameTime) => { // remember: arrow functions don't bind `this`.
      const { view } = this.props;

      //TODO the api doesn't give us `frameTime` from the last frame :(, skip animating the first frame
      if (lastFrameTime) {
        if (view.dx !== 0 || view.dy !== 0) {
          const screensPerSecond = 0.5;
          const factor = screensPerSecond * (frameTime - lastFrameTime) / 1000;
          this.setState({
            viewOffset: {
              x: this.state.viewOffset.x + factor * view.dx,
              y: this.state.viewOffset.y + factor * view.dy,
            }
          });
        }
      }

      lastFrameTime = frameTime;
      window.requestAnimationFrame(stepFrame);
    };
    window.requestAnimationFrame(stepFrame);
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
    const { tool, view, terrain, tracks, trains, buildings } = this.props;

    const box = _.map([-1 + this.state.viewOffset.x, -1 + this.state.viewOffset.y, 2, 2], c => c * view.scale);

    return (
      <HexGrid width="100%" height="100%" viewBox={box.join(' ')}>
        <Layout size={{ x: 1, y: 1 }}>
          <g className={classNames('tiles', { touchable: this.isTouchable('tile') })}>
            {_.map(terrain, (tile, key) => (
              <Tile
                className={classNames({ touchable: this.isTouchable('tile') })}
                key={key}

                {...tile}

                onClick={this.makeHexToolEventDelegator('onClick', tile)}
                // onMouseDown={this.makeHexToolEventDelegator('onMouseDown')}
                // onMouseUp={this.makeHexToolEventDelegator('onMouseUp')}
                onMouseEnter={this.makeHexToolEventDelegator('onMouseEnter', tile)}
                onMouseLeave={this.makeHexToolEventDelegator('onMouseLeave', tile)}

                // onDragStart={this.makeHexToolEventDelegator('onDragStart')}
                // onDragOver={this.makeHexToolEventDelegator('onDragStart')}
                // onDrop={this.makeHexToolEventDelegator('onDragOver')}
                // onDragEnd={this.makeHexToolEventDelegator('onDragEnd')}
              >
                <Text className="debug">{tile.hex.toString()}</Text>
              </Tile>
            ))}
          </g>
          <g className={classNames('tracks', { touchable: this.isTouchable('track') })}>
            {_.map(tracks, (track) => (
              <Path
                key={`${track.v} -> ${track.w}`}
                className="track"
                hexes={[track.v, track.w]}

                onClick={this.makeHexToolEventDelegator('onClick', track)}
                // onMouseEnter={this.makeHexToolEventDelegator('onMouseEnter', tile)}
                // onMouseLeave={this.makeHexToolEventDelegator('onMouseLeave', tile)}
              />
            ))}
          </g>
          <g className={classNames('buildings', { touchable: this.isTouchable('building') })}>
            {_.map(buildings, building => {
              const BuildingComp = reactBuildings[building.type] || Building;
              return <BuildingComp
                key={building.name}
                {...building}

                onClick={this.makeHexToolEventDelegator('onClick', building)}
              />;
            })}
          </g>
          <g className={classNames('trains', { touchable: this.isTouchable('train') })}>
            {trains && _.map(trains, (train) => (
              <TrainCar
                key={train.name}
                {...train}

                onClick={this.makeHexToolEventDelegator('onClick', train)}
              />
            ))}
          </g>

          <g className="tool">
            {tool.hexes.length && <Path hexes={tool.hexes} />}
          </g>

        </Layout>
      </HexGrid>
    );
  }
}

export default connect(s => ({ ...getGame(s), tool: getTool(s), view: getView(s) }))(Map);