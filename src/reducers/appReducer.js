import { combineReducers } from 'redux';

import Hex from '../lib/Hex';

import tool from './tool';
import game from './game';


const terrain = () => ({ [Hex.origin]: { type: 'grass', color: 'green' } });

export default combineReducers({ tool, terrain, game})
