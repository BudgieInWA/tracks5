import _ from 'lodash';
import { combineReducers } from "redux";

import Hex from '../lib/Hex';
import CardinalDirection from "../lib/CardinalDirection";
import TrackNetwork from "../lib/TrackNetwork";

import ActionTypes from "./ActionTypes";

const segments = 3;


const name = (state = null, action) => action.type === ActionTypes.trains.name ? action.name : state;

/**
 * Calculate train positions after a round of movement.
 *
 * @param {Object[]} trains
 * @param {TrackNetwork} network
 */
export function moveTrains(trains, network) {
  // TODO check for collisions first
  return _.map(trains, train => {
    if (train.speed === 0) return train;
    let { hex, direction, distance, destination, speed } = train;

    // TODO a round of reconsiliating move intentions using track rules
    // TODO update speed

    let moved = 0;
    while (moved < speed) {
      // Choose a destination if needed.
      if (!train.destination) {
        const nextRail = network.optionsFrom(train.hex, train.direction)[0];
        if (nextRail) {
          destination = nextRail.w.toString();
          direction = nextRail.direction.toString();
          if (!direction) {
            console.warn({direction}, 'should be valid');
          }
        } else {
          speed = 0;
          console.info(`Train ${train.name || train} doesn't have any track to follow. Stopping`);
          break;
        }
      }

      // Move forward
      distance += 1/segments;
      moved++;

      // Fall off the end if needed
      if (distance >= 1) {
        hex = train.destination;
        distance = 0;
        destination = null;
      }
    }

    return { ...train, hex, direction, distance, destination, speed };
  });
}

const defaultTrain = {
  name: "default train",
  hex: Hex.origin.toString(),
  direction: CardinalDirection.SE.toString(),
  distance: 0/segments,
  speed: 1,
  destination: null,
};

function train(state = {}, action) {
  return state;
}

export default function trains(state=[defaultTrain], action) {
  switch(action.type) {
    case ActionTypes.trains.build:
      return [ ...state, train(undefined, action) ];
    case ActionTypes.train.name:
      console.warn('untested');
      return [
        ...state.slice(0, action.index),
        train(state[action.index]),
        ...state.slice(action.index),
      ];
    default:
      return state;
  }
}


function transformTrain(state) {
  return {
    ...state,
    hex: Hex.of(state.hex),
    direction: CardinalDirection.of(state.direction),
  }
}
export function getTrains(state) {
  return _.map(state, transformTrain);
}
