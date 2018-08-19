import { combineReducers } from 'redux';

import ActionTypes from './ActionTypes';
import tool from './tool';
import game from './game';

function view(state = { scale: 1, dx: 0, dy: 0 }, action) {
  switch (action.type) {
    case ActionTypes.view.pan: return { ...state, dx: action.dx, dy: action.dy };
    case ActionTypes.view.zoomIn: return { ...state, scale: Math.min(10, state.scale - 1)};
    case ActionTypes.view.zoomOut: return { ...state, scale: Math.max(1, state.scale + 1)};
    default: return state;
  }
}

export const getView = state => state.view;

export default combineReducers({ tool, game, view });
