import _ from "lodash";
import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { HexGrid, Layout, Text } from "react-hexgrid";
import Hex from './lib/Hex';

import ActionTypes from './reducers/ActionTypes';
import { getHandlersFactory, nullFactory } from './things/tools';
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
    let frameRequest = null;
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
    this.stopAnimation = () => window.cancelAnimationFrame(frameRequest);
  }

  componentWillUnmount() {
    this.stopAnimation();
  }


  render() {
    const { dispatch, tool, view, terrain, tracks, trains, buildings } = this.props;

    const box = _.map([-1 + this.state.viewOffset.x, -1 + this.state.viewOffset.y, 2, 2], c => c * view.scale);

    return (
      <HexGrid width="100%" height="100%" viewBox={box.join(' ')}>
        <Layout size={{ x: 1, y: 1 }}>
          <Terrain     terrain={terrain}   handlersFactory={getHandlersFactory(() => this.props.tool, { targetName: 'tile', dispatch })} />
          <Tracks       tracks={tracks}    handlersFactory={getHandlersFactory(() => this.props.tool, { targetName: 'track', dispatch })} />
          <Buildings buildings={buildings} handlersFactory={getHandlersFactory(() => this.props.tool, { targetName: 'building', dispatch })} />
          <Trains       trains={trains}    handlersFactory={getHandlersFactory(() => this.props.tool, { targetName: 'train', dispatch })} />

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
    console.debug('rendering Terrain')
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


export default connect(s => ({ ...getGame(s), tool: getTool(s), view: getView(s) }))(Map);