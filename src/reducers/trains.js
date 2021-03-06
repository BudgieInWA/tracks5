import _ from 'lodash';
// import { combineReducers } from "redux";
import { HexUtils } from 'react-hexgrid';

import Hex from '../lib/Hex';
import CardinalDirection from '../lib/CardinalDirection';
import TrackNetwork from '../lib/TrackNetwork';
import Inventory from '../lib/Inventory';

import ActionTypes from './ActionTypes';

export const SEGMENTS = 3;

const name = (state = null, action) =>
  action.type === ActionTypes.trains.name ? action.name : state;

const cmp = (a, b) => {
  return Math.abs(b - a) < 0.0001;
};

/**
 * Calculate train positions after a round of movement.
 *
 * @param {Object[]} trains
 * @param {TrackNetwork} network
 */
export function moveTrains(trains, network) {
  // TODO check for collisions first
  return _.map(trains, (train) => {
    let { hex, destination, direction, distance, speed, schedule, path, targetSpeed } = train;

    // const thing = schedule[hex];
    // if (thing) {
    //   // Do a round of reconciliation move intentions using track rules
    //   targetSpeed = thing.targetSpeed;
    // }

    // 1. accelerate towards the target speed.
    if (_.isNumber(targetSpeed)) {
      if (targetSpeed === speed) {
        // targetSpeed = null;
      } else if (targetSpeed > speed) {
        speed++; // Super acceleration. TODO add a cooldown for the next accell
      } else {
        speed = targetSpeed; // Super super deceleration.
      }
    }

    let moved = 0;
    while (moved < speed) {
      // Ensure we have a destination direction if we're heading out.
      if (distance === 0) {
        // Try to choose a direction using one of the routing mechanisms.
        let nextRail;
        if (hex in schedule) {
          // We want to take the `hex` item out and use it.
          let { [hex]: nextSchedule, ...rest } = schedule;
          schedule = { ...rest };
          nextRail = network.rail({ v: train.hex, w: nextSchedule.destination });
        } else if (path.length && cmp(HexUtils.distance(Hex.of(hex), Hex.of(path[0])), 1)) {
          // We want to take the next item out and use it.
          const [next, ...rest] = path;
          path = rest;
          nextRail = network.rail({ v: train.hex, w: next });
        } else {
          // Choose a random direction for now.
          // nextRail = network.optionsFrom(train.hex, train.direction)[0];
        }

        if (nextRail) {
          destination = nextRail.w.toString();
          direction = nextRail.direction.toString();
        } else {
          // Train chose no track so it stops.
          speed = 0;
          break;
        }
      }

      // Move forward,
      distance++;
      moved++;

      // If we've crossed into the other hex, swap over.
      if (distance > Math.floor(SEGMENTS / 2)) {
        distance -= SEGMENTS;
        // from = hex;
        hex = destination;
        destination = null;
      }
    }

    return { ...train, hex, destination, direction, distance, speed, schedule, path, targetSpeed };
  });
}

function train(state = {}, action) {
  switch (action.type) {
    case ActionTypes.trains.add:
      const { id, hex, direction, distance = 0, targetSpeed = 1, inventory } = action;
      return {
        id,
        name: 'new train ' + action.id,

        hex,
        direction,
        distance,
        destination: null, // Must be set when distance > 0. Train is on track hex -> destination

        schedule: {},
        path: [],

        speed: 0,
        targetSpeed,
      };

    default:
      return state;
  }
}

export default function trains(state = [], action) {
  switch (action.type) {
    case ActionTypes.trains.add:
      action.id = state.length;
      return [...state, train(undefined, action)]; // TODO

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

    case ActionTypes.train.path:
      return [
        ...state.slice(0, action.id),
        { ...state[action.id], path: action.path },
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
    inventory: new Inventory(state.game.inventories[`train.${train.id}`]),
  };
}
export function transformTrains(trains, state) {
  return _.map(trains, (t) => transformTrain(t, state));
}
