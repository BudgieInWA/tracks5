import  _ from 'lodash';
import { combineReducers } from 'redux';
import TrackNetwork  from '../lib/TrackNetwork';

import ActionTypes from "./ActionTypes";

import terrain, { seed, transformTerrain, revealTerrain } from './terrain';
import buildings from './buildings';
import tracks, { transformTracks } from './tracks';
import trains, { moveTrains, transformTrains } from './trains';
import { getTradesThatHappen, executeTrades } from './stores';


const stores = (state = {}, action) => {
  return state;
};

const nested = combineReducers({ terrain, buildings, tracks, trains, stores });


function gameTopLevelReducer(state = {}, action) {
  switch(action.type) {
    case ActionTypes.train.goto: {
      const train = state.trains[action.id];
      const foundPath = new TrackNetwork(state.tracks).shortestPath(train.destination || train.hex, action.hex);
      if (!foundPath) return state;
      const [currentHex, ...path] = foundPath;
      return {
        ...state,
        trains: trains(state.trains, { type: ActionTypes.train.path, id: action.id, path }),
      };
    }

    case ActionTypes.game.transferPhase: {
      return {
        ...state,
        stores: executeTrades(state.stores, getTradesThatHappen(state)),
      };
    }

    case ActionTypes.game.turnResolve: {
      return _.reduce(
        [{ type: ActionTypes.game.movePhase }, { type: ActionTypes.game.explorePhase }],
        gameTopLevelReducer,
        state
      );
    }

    case ActionTypes.game.movePhase: {
      return {
        ...state,
        trains: moveTrains(state.trains, new TrackNetwork(state.tracks)),
      };
    }

    case ActionTypes.game.explorePhase: {
      const { terrain, trains, buildings } = state;
      return {
        ...state,
        terrain: revealTerrain(terrain, { trains, buildings })
      };
    }

    default: {
      return state;
    }
  }
}

export default function game(state, action) {
  return nested(gameTopLevelReducer(state, action), action);
}

export function getGame(state) {
  return {
    ...state.game,
    terrain: transformTerrain(state.game.terrain),
    trains: transformTrains(state.game.trains, state),
    tracks: transformTracks(state.game.tracks, state),
    seed,
  };
}
