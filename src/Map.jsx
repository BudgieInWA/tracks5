import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { HexGrid, Layout, Text } from "react-hexgrid";
import Hex from './lib/Hex';

import ActionTypes from './reducers/ActionTypes';
import { getHandlersFactory, nullFactory } from './things/tools';
import { getGame } from './reducers/game';
import { getTool } from './reducers/tool';
import { getInputs } from './reducers/inputs';

import Building from "./svg/Building.jsx";
import TrainCar from "./svg/TrainCar.jsx";
import Tile from "./svg/Tile.jsx";
import Path from "./svg/Path.jsx";

import * as reactBuildings from './things/buildings';

class Map extends React.Component {
  static propTypes = {
    inputs: PropTypes.shape({
      up: PropTypes.bool,
      left: PropTypes.bool,
      down: PropTypes.bool,
      right: PropTypes.bool,
    }),

    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      viewOffset: { x: 0, y: 0 },
    };

    let lastFrameTime = null;
    let frameRequest = null;
    const stepFrame = (frameTime) => { // remember: arrow functions don't bind `this`.
      const { inputs: { up, left, down, right } } = this.props;

      //TODO the api doesn't give us `frameTime` from the last frame :(, skip animating the first frame
      if (lastFrameTime) {
        const dx = 0 + right - left;
        const dy = 0 + down - up;
        if (dx !== 0 || dy !== 0) {
          const screensPerSecond = 0.5;
          const factor = screensPerSecond * (frameTime - lastFrameTime) / 1000;
          this.setState({
            viewOffset: {
              x: this.state.viewOffset.x + factor * dx,
              y: this.state.viewOffset.y + factor * dy,
            }
          });
        }
      }
      lastFrameTime = frameTime;
      window.requestAnimationFrame(stepFrame);
    };
    window.requestAnimationFrame(stepFrame);
    this.stopAnimation = () => window.cancelAnimationFrame(frameRequest);
  }

  componentWillUnmount() {
    this.stopAnimation();
  }


  render() {
    const { dispatch, tool, inputs: { zoomScale }, terrain, tracks, trains, buildings } = this.props;

    const box = _.map([-1 + this.state.viewOffset.x, -1 + this.state.viewOffset.y, 2, 2], c => c * zoomScale);

    // The tool function needs to reference `this`, not `tool` directly, so that it returns current tool at call time.
    const finishFactory = _.partial(getHandlersFactory, () => this.props.tool);

    return (
      <HexGrid width="100%" height="100%" viewBox={box.join(' ')}>
        <Layout size={{ x: 1, y: 1 }}>
          <Terrain     terrain={terrain}   handlersFactory={finishFactory({ targetName: 'tile', dispatch })} />
          <Tracks       tracks={tracks}    handlersFactory={finishFactory({ targetName: 'track', dispatch })} />
          <Buildings buildings={buildings} handlersFactory={finishFactory({ targetName: 'building', dispatch })} />
          <Trains       trains={trains}    handlersFactory={finishFactory({ targetName: 'train', dispatch })} />

          <g className="tool">
            {tool.hexes.length && <Path hexes={tool.hexes} />}
          </g>

        </Layout>
      </HexGrid>
    );
  }
}


class Terrain extends React.PureComponent {
  render() {
    const { terrain, handlersFactory } = this.props;
    console.debug('rendering Terrain');
    return (
      <g className={classNames('tiles', { touchable: handlersFactory !== nullFactory })}>
        {_.map(terrain, (tile, key) => (
          <Tile
            className={classNames({ touchable: handlersFactory !== nullFactory })}
            key={key}

            {...tile}
            {...handlersFactory(tile)}
          >
            <Text className="debug">{tile.hex.toString()}</Text>
          </Tile>
        ))}
      </g>
    );
  }
}

class Tracks extends React.PureComponent {
  render () {
    const { tracks, handlersFactory } = this.props;
    return (
      <g className={classNames('tracks', { touchable: handlersFactory !== nullFactory })}>
        {_.map(tracks, (track) => (
          <Path
            key={`${track.v} -> ${track.w}`}
            className="track"

            hexes={[track.v, track.w]}
            {...handlersFactory(track)}
          />
        ))}
      </g>
    );
  }
}
class Buildings extends React.PureComponent {
  render() {
    const { buildings, handlersFactory } = this.props;
    return (
      <g className={classNames('buildings', { touchable: handlersFactory !== nullFactory })}>
        {_.map(buildings, building => {
          const BuildingComp = reactBuildings[building.type] || Building;
          return <BuildingComp
            key={building.name}

            {...building}
            {...handlersFactory(building)}
          />;
        })}
      </g>
    );
  }
}
class Trains extends React.PureComponent {
  render() {
    const { trains, handlersFactory } = this.props;
    return (
      <g className={classNames('trains', { touchable: handlersFactory !== nullFactory })}>
        {_.map(trains, (train) => (
          <TrainCar
            key={train.name}

            {...train}
            {...handlersFactory(train)}
          />
        ))}
      </g>
    );
  }
}


export default connect(s => ({ ...getGame(s), tool: getTool(s), inputs: getInputs(s) }))(Map);