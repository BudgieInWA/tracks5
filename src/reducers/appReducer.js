import { combineReducers } from 'redux';

import tool from './tool';
import inputs from './inputs';
import game from './game';

export default combineReducers({ tool, game, inputs });
