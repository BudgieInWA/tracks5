import { combineReducers } from "redux";

import { Hex } from "react-hexgrid";

import tool from "./tool";
import tracks from "./tracks";

const buildings = () => [{hex: Hex.origin, name: 'test building'}];

const terrain = () => ({ [Hex.origin]: { type: 'grass', color: 'green' } });

const trains = () => [];


export default combineReducers({ tool, terrain, tracks, buildings, trains })
