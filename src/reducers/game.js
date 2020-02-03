import  _ from 'lodash';
import { combineReducers } from 'redux';

import ActionTypes from "./ActionTypes";

import terrain, { seed, transformTerrain, revealTerrain } from './terrain';
import buildings, { transformBuildings } from './buildings';
import tracks, { transformTracks } from './tracks';
import trains, { moveTrains, transformTrains } from './trains';
import inventories from './inventories';

import { HexUtils } from 'react-hexgrid';
import Hex from '../lib/Hex';
import CardinalDirection from '../lib/CardinalDirection';
import TrackNetwork  from '../lib/TrackNetwork';


const nested = combineReducers({ terrain, buildings, tracks, trains, inventories });


function gameTopLevelReducer(state, action) {
  if (state === undefined) {
    // Build some default things as an example.

    // Walk around in a circle to build a path.
    let direction = CardinalDirection.N;
    let hex = Hex.origin;
    const path = [];
    do {
      path.push(hex);
      hex = HexUtils.add(hex, direction);
      direction = direction.left;
    } while (!HexUtils.equals(hex, path[0]));
    path.push(hex); // close the path.

    state = _.reduce([
      {
        type: ActionTypes.game.buildBuilding,
        building: 'home',
        hex: Hex.origin.toString(),
      },
      {
        type: ActionTypes.tracks.build,
        hexes: path,
      },
      {
        type: ActionTypes.game.buildTrain,
        hex: Hex.origin.toString(),
        direction: CardinalDirection.N.toString(),
      },
      {
        type: ActionTypes.game.buildBuilding,
        building: 'LumberYard',
        hex: new Hex(2, 5).toString(),
      },
    ], game, {});
  }

  try {
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
          inventories: inventories(state, action),
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

      case ActionTypes.game.buildBuilding: {
        const buildingId = _.keys(state.buildings).length;
        return {
          ...state,
          buildings: buildings(state.buildings, { ...action, type: ActionTypes.buildings.add, id: buildingId }),
          inventories: inventories(state.inventories, { type: ActionTypes.inventories.limit, id: `building.${buildingId}`, slotCount: 100, slotCapacity: 100 }),
        };
      }

      case ActionTypes.game.buildTrain: {
        const trainId = _.keys(state.trains).length;
        return {
          ...state,
          trains: trains(state.trains, { ...action, type: ActionTypes.trains.add, id: trainId }),
          inventories: inventories(state.inventories, { type: ActionTypes.inventories.limit, id: `train.${trainId}`, slotCount: 3, slotCapacity: 3 }),
        };
      }

      default: {
        return state;
      }
    }
  } catch (reducerError) {
    console.warn('Game reducer failed, action ignoredaction', { action, reducerError });
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
    buildings: transformBuildings(state.game.buildings, state),
    tracks: transformTracks(state.game.tracks, state),
    trains: transformTrains(state.game.trains, state),
    seed,
  };
}
