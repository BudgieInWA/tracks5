import  _ from 'lodash';
import { combineReducers } from 'redux';
import Hex from '../lib/Hex';
import TrackNetwork  from '../lib/TrackNetwork';

import ActionTypes from "./ActionTypes";

import terrain from './terrain';
import buildings from './buildings';
import tracks from './tracks';
import trains, { moveTrains, getTrains } from './trains';

const gameSubReducer = combineReducers({ terrain, buildings, tracks, trains });

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
  return gameSubReducer(gameTopLevelReducer(state, action), action);
}


export function getGame(state) {
  return {
    ...state.game,
    trains: getTrains(state.game.trains),
    tool: state.tool,
  };
}
