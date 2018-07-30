import { combineReducers } from 'redux';

import { Hex } from 'react-hexgrid';

import ActionTypes from './ActionTypes';

const toolName = (state = 'line', action) => action.type === ActionTypes.toolName ? action.toolName : state;

function path(state = [], action) {
  switch(action.type) {
    case ActionTypes.path.start:  return [action.hex, action.hex];
    case ActionTypes.path.end: return state.length === 0 ? [] : [state[0], action.hex];
    case ActionTypes.path.clear:  return [];
    default: return state;
  }
}

const buildings = () => [{hex: Hex.origin, name: 'test building'}];

const terrain = () => ({ [Hex.origin]: { type: 'grass', color: 'green' } });


export default combineReducers({ toolName, buildings, path, terrain })
