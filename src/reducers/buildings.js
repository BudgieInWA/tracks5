import _ from "lodash";

import Hex  from '../lib/Hex';

import Inventory from '../lib/Inventory';

import ActionTypes from "./ActionTypes";

function building(state={}, action) {
  if (action.type === ActionTypes.buildings.add) {
    //TODO check the rules
    const { id, hex, building: type } = action;
    return {
      id,
      name: `${type || 'building'} ${id}`,

      type,
      hex,
    }
  }
  return state;
}



export default function buildings(state = [], action) {
  switch(action.type) {
    case ActionTypes.buildings.add:
      return [
        ...state,
        building(undefined, action),
      ];

    default:
      return state;
  }
}

function transformBuilding(building, state) {
  return {
    ...building,
    hex: Hex.of(building.hex),
    inventory: new Inventory(state.game.inventories[`building.${building.id}`]),
  }
}
export function transformBuildings(buildings, state) {
  return _.map(buildings, b => transformBuilding(b, state));
}
