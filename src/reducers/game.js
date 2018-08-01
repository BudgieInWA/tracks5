import  _ from 'lodash';
import { combineReducers } from 'redux';
import { Hex } from "react-hexgrid";

import ActionTypes from "./ActionTypes";

import tracks, { withNetwork, TrackNetwork } from './tracks';
import trains, { moveTrains, getTrains } from './trains';

const buildings = () => [{hex: Hex.origin, name: 'test building'}];

const gameSubReducer = combineReducers({ buildings, tracks, trains });

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
