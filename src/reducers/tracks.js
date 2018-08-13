import _ from "lodash";

import TrackNetwork  from '../lib/TrackNetwork';

import ActionTypes from "./ActionTypes";


import { HexUtils } from 'react-hexgrid';
import Hex from '../lib/Hex';
import CardinalDirection from '../lib/CardinalDirection';
// Walk around in a circle.
const defaultNetwork = new TrackNetwork();
let direction = CardinalDirection.N;
let hex = Hex.origin;
const path = [];
do {
  path.push(hex);
  hex = HexUtils.add(hex, direction);
  direction = direction.left;
} while (!HexUtils.equals(hex, path[0]));
path.push(hex); // close the path.
defaultNetwork.addPath(path);
const defaultTracks = defaultNetwork.state();
// const defaultTracks = new TrackNetwork().state();

export default function tracks(state = defaultTracks, action) {
  if (!_.includes(ActionTypes.tracks, action.type)) return state;

  const network = new TrackNetwork(state);

  switch(action.type) {
    case ActionTypes.tracks.build:
      network.addPath(action.hexes);
      break;

    default:
      return state;
  }

  return network.state();
}

export function transformTracks(tracks, state) {
  const network = new TrackNetwork(tracks);
  return network.rails();
}

export function getTracks(state) {
  return transformTracks(state.game.tracks, state);
}



