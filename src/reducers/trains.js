import _ from 'lodash';
import { combineReducers } from "redux";

import Hex from '../lib/Hex';
import CardinalDirection from "../lib/CardinalDirection";
import TrackNetwork from "../lib/TrackNetwork";
import Store from '../lib/Store';

import ActionTypes from "./ActionTypes";

export const SEGMENTS = 3;


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
    let { hex, destination,  direction, distance, speed, schedule, targetSpeed, } = train;

    const thing = schedule[hex];
    if (thing) {
      // Do a round of reconciliation move intentions using track rules
      targetSpeed = thing.targetSpeed;
    }

    if (_.isNumber(targetSpeed)) {
      if (targetSpeed === speed ) {
        targetSpeed = null;
      } else if (targetSpeed > speed) {
        speed++; // Super acceleration. TODO add a cooldown for the next accell
      } else {
        speed = targetSpeed;
      }
    }

    // TODO update speed

    let moved = 0;
    while (moved < speed) {
      // Ensure we have a destination direction if we're heading out.
      if (distance >= 0 && !destination) {
        let nextRail;
        if (hex in schedule) {
          // We want to take the `hex` item out and use it.
          let { [hex]: nextSchedule, ...rest } = schedule;
          schedule = { ...rest };

          nextRail = network.rail({ v: train.hex, w: nextSchedule.destination });
        } else {
          // Choose a random direction for now.
          nextRail = network.optionsFrom(train.hex, train.direction)[0];
        }

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
      distance++;
      moved++;

      // If we've crossed into the other hex, swap over.
      if (distance > Math.floor(SEGMENTS / 2)) {
        distance -= SEGMENTS;
        hex = destination;
        destination = null;
      }
    }

    return { ...train, hex, destination,  direction, distance, speed, schedule, targetSpeed, };
  });
}

const defaultTrain = {
  name: "default train",
  hex: Hex.origin.toString(),
  direction: CardinalDirection.SE.toString(),
  distance: 0,
  speed: 1,
  destination: null,
  store: 1,
  schedule: {},
};

function train(state = {}, action) {
  switch(action.type) {
    default:
      return state;
  }
}

export default function trains(state=[defaultTrain], action) {
  switch(action.type) {
    case ActionTypes.trains.build:
      return [ ...state, defaultTrain ]; // TODO

    case ActionTypes.trains.targets:
      return [
        ...state.slice(0, action.id),
        { ...state[action.id], targetSpeed: action.speed },
        ...state.slice(action.id + 1),
      ];

    case ActionTypes.trains.schedule:
      return [
        ...state.slice(0, action.id),
        { ...state[action.id], schedule: action.schedule },
        ...state.slice(action.id + 1),
      ];

    case ActionTypes.trains.name:
      console.warn('untested');
      return [
        ...state.slice(0, action.id),
        { ...state[action.id], name: action.name },
        ...state.slice(action.id + 1),
      ];

    default:
      return state;
  }
}


function transformTrain(train, state) {
  return {
    ...train,
    hex: Hex.of(train.hex),
    destination: Hex.of(train.destination),
    direction: CardinalDirection.of(train.direction),
    // store: new Store(state.stores[train.store]),
  }
}
export function transformTrains(trains, state) {
  return _.map(trains, t => transformTrain(t, state));
}
