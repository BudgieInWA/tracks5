import _ from 'lodash';
import { combineReducers } from "redux";

import { Hex } from "react-hexgrid";
import Directions from "../Directions";

import ActionTypes from "./ActionTypes";

const name = (state = null, action) => action.type === ActionTypes.trains.name ? action.name : state;

// Calculate train positions after a round of movement.
function movePhase(trains, network) {
  return _.map(trains, train => {
    //FIXME
    return { ... train, distance: train.distance + train.speed };
  });
}

const defaultTrain = {
  name: "default train",
  hex: Hex.origin,
  direction: Directions.NE,
  distance: 2/3,
  speed: 1/3,
  destination: null,
  edge: null,
};

function train(state = {}, action) {
  return state;
}

export default function trains(state=[defaultTrain], action) {
  switch(action.type) {
    case ActionTypes.trains.build:
      return [ ...state, train(action.train, action) ];
    case ActionTypes.trains.movePhase:
      return movePhase(state);
    default:
      return state;
  }
}
