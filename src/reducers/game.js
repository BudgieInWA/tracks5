import  _ from 'lodash';
import { combineReducers } from 'redux';
import TrackNetwork  from '../lib/TrackNetwork';

import ActionTypes from "./ActionTypes";

import terrain, { transformTerrain } from './terrain';
import buildings from './buildings';
import tracks from './tracks';
import trains, { moveTrains, transformTrains } from './trains';

const nested = combineReducers({ terrain, buildings, tracks, trains });

function gameTopLevelReducer(state = {}, action) {
  switch(action.type) {
    case ActionTypes.game.movePhase:
      return {
        ...state,
        trains: moveTrains(state.trains, new TrackNetwork(state.tracks)),
      };

    default:
      return state;
  }
}

export default function game(state, action) {
  return nested(gameTopLevelReducer(state, action), action);
}

export function getGame(state) {
  return {
    ...state.game,
    terrain: transformTerrain(state.game.terrain),
    trains: transformTrains(state.game.trains),
    tool: state.tool,
  };
}
