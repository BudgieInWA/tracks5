import { combineReducers } from "redux";

import { HexUtils } from "react-hexgrid";

import ActionTypes from "./ActionTypes";


function poke(state = null, action) {
  if (action.type === ActionTypes.tool.poke) {
    return action.poke
  }
  return state;
}

function hexesCrossedByLine(start, end) {
  const distance = HexUtils.distance(start, end);
  if (distance === 0) return [end];
  if (distance === 1) return [start, end];

  const intersects = [];
  let step = 1.0 / Math.max(distance, 1);
  for (let i = 0; i <= distance; i++) {
    intersects.push(HexUtils.round(HexUtils.hexLerp(start, end, step * i)));
  }
  return intersects;
}

function hexes(state = [], action) {
  switch(action.type) {
    case ActionTypes.tool.hexes.start:
      return [action.hex];

    case ActionTypes.tool.hexes.end:
      if (state.length === 0) return state;

      // "Unravel" the path if it is being traced backwards.
      if (state.length > 1 && HexUtils.equals(state[state.length - 2], action.hex)) {
        return [...state.slice(0, -1)];
      }

      const path = [...state];
      // Add the chain of hexes between the end and the new hex.
      // TODO unravel the track until the new hexes can be added to form a valid track path.
      // FIXME can go backwards
      while (true) {
        const newHexes = hexesCrossedByLine(path[path.length - 1], action.hex).slice(1);
        if (newHexes.length === 0) return path;
        const cmp = (a, b) => {
          return Math.abs(b - a) < 0.0001;
        };
        const blah = (path.length > 1) && cmp(HexUtils.distance(newHexes[0], path[path.length - 2]), 1);
        if (blah) {
          path.pop();
        } else {
          return path.concat(...newHexes);
        }
      }

    case ActionTypes.tool.hexes.clear:
      return [];

    default:
      return state;
  }
}

export function getTool(state) {
  return state.tool;
}

const nested = combineReducers({ name: (s='poke') => s, poke, hexes });

export default function tool(state = {}, action) {
  switch(action.type) {
    case ActionTypes.tool.name:
      return nested({ name: action.name }, action);

    default:
      return nested(state, action);
  }
}
