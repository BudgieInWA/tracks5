import { combineReducers } from 'redux';

import Hex from '../lib/Hex';

import tool from './tool';
import game from './game';


export default combineReducers({ tool, game})
