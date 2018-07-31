import { combineReducers } from "redux";

import { Hex } from "react-hexgrid";
import Directions from "../Directions";

import ActionTypes from "./ActionTypes";

const name = (state = null, action) => action.type === ActionTypes.trains.name ? action.name : state;
const direction = (state = Directions.N, action) => action.type === ActionTypes.trains.direction ? action.direction : state;

const train = combineReducers({ name, direction, hex: () => Hex.origin });

const defaultTrain = {
  name: "default train",
  direction: Directions.NE,
  hex: Hex.origin,
};

export default function trains(state=[defaultTrain], action) {
  switch(action.type) {
    case ActionTypes.trains.build:
      return [ ...state, train(action.train, action) ];
    case ActionTypes.trains.name:
    case ActionTypes.trains.direction:
      return state.map(t => train(t, action));
    default:
      return state;
  }
}
