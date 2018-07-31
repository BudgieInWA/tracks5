import { combineReducers } from "redux";

import { HexUtils } from "react-hexgrid";

import ActionTypes from "./ActionTypes";


const name = (state = 'poke', action) => action.type === ActionTypes.tool.name ? action.name : state;

function hexesCrossedByLine(start, end) {
  const distance = HexUtils.distance(start, end);
  if (distance === 0) return [end];
  if (distance === 1) return [start, end];

  const intersects = [];
  let step = 1.0 / Math.max(distance, 1);
  for (let i=0; i<=distance; i++) {
    intersects.push(HexUtils.round(HexUtils.hexLerp(start, end, step * i)));
  }
  return intersects;
}

function hexes(state = [], action) {
  switch(action.type) {
    case ActionTypes.tool.hexes.start:
      return [action.hex];

    case ActionTypes.tool.hexes.end:
      if (action.hex === state[0]) return state;
      if (state.length === 0) return state;

      // "Unravel" the path if it is being traced backwards.
      if (state.length > 1 && HexUtils.equals(state[state.length - 2], action.hex)) {
        return [...state.slice(0, -1)];
      }

      // Add the chain of hexes between the end and the new hex.
      return [...state, ...hexesCrossedByLine(state[state.length - 1], action.hex).slice(1)];

    case ActionTypes.tool.hexes.clear:
    case ActionTypes.tool.name:
      return [];

    default:
      return state;
  }
}

export function getTool(state) {
  return state.tool;
}

export default combineReducers({ name, hexes });
