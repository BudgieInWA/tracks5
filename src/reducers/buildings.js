import _ from "lodash";

import Hex  from '../lib/Hex';

import ActionTypes from "./ActionTypes";

function building(state={}, action) {
  if (action.type === ActionTypes.buildings.build) {
    //TODO check the rules
    return {
      type: action.building,
      hex: action.hex,
      name: 'a fake name',
    }
  }
}

const defaultBuilding = {
  type: 'Station',
  hex: Hex.origin,
  name: 'test building',
};

export default function buildings(state = [defaultBuilding], action) {
  switch(action.type) {
    case ActionTypes.buildings.build:
      return [
        ...state,
        building(undefined, action),
      ];

    default:
      return state;
  }
}
