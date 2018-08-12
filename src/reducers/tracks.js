import _ from "lodash";

import TrackNetwork  from '../lib/TrackNetwork';

import ActionTypes from "./ActionTypes";

export default function tracks(state = new TrackNetwork().state(), action) {
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



