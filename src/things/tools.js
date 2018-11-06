import _ from 'lodash';
import React from 'react';
import ActionTypes from "../reducers/ActionTypes";

import Path from "../svg/Path.jsx";

//(TODO `class`ify)
export const tools = {
  //TODO train directions
  // Maybe poke selects a poked train allowing it to trasform the tool? Or poking changes you to the tool.


  poke: {
    touchTargets: { tile: true, building: true, track: true, train: true },
    handlers: {
      onClick(thing, event, { dispatch }) {
        console.info('Poke!', { thing, event });
        dispatch({ type: ActionTypes.tool.poke, poke: thing });
      },
    },

    // onDragStart(event, hexComponent) { },
    // onDragOver(event, hexComponent)  { },
    // onDrop(event, hexComponent, droppedHexComponent) { },
  },

  track: {
    touchTargets: { tile: true },
    handlers: {
      onClick({ hex }, event, { dispatch }) {
        if (this.hexes.length === 0) {
          dispatch({ type: ActionTypes.tool.hexes.start, hex });
        } else {
          dispatch({ type: ActionTypes.tracks.build, hexes: this.hexes });
          dispatch({ type: ActionTypes.tool.hexes.clear });
        }
      },
      onMouseEnter({ hex }, event, { dispatch }) {
        if (this.hexes.length > 0) {
          dispatch({ type: ActionTypes.tool.hexes.end, hex });
        }
      },

    },
    renderMap: ({ tool: { hexes } }) => hexes && hexes.length ? <Path hexes={hexes} /> : null,
  },

  // building: {
  //   touchTargets: { tile: true },
  //   getOptions() {
  //     // TODO...
  //   },
  //   handlers: {
  //     onClick({ hex }, event, { dispatch }) {
  //       dispatch({ type: ActionTypes.buildings.build, hex, building: this.option || 'Station' });
  //     },
  //   },
  // },

  // train: {
  //   touchTargets: { track: true },
  //   getOptions() {
  //     // TODO...
  //   },
  //   handlers: {
  //     onClick(rail, event, { dispatch }) {
  //       dispatch({ type: ActionTypes.trains.build, hex: rail.v, direction: rail.direction });
  //     },
  //   },
  // },

  controlTrain: {
    touchTargets: { tile: true },
    stateToOptions: (state) => _.keys(state.game.trains),
    handlers: {
      onClick({ hex }, event, { dispatch }) {
        if (this.option.length) {
          dispatch({ type: ActionTypes.train.goto, id: this.option, hex: hex.toString() })
        }
      }
    },
    renderMap({ tool: { selection }, trains}) {
      //TODO only rerender in sync with train animations (rerender at last 1/3rd breaks animation).
      const renderTrain = t => t.path && t.path.length || t.destination ? <Path key={t.name || t.id} hexes={[t.hex, (t.destination || t.hex), ...t.path]} className="train-path" /> : null;
      if (selection) {
        return renderTrain(trains[selection]);
      } else {
        return _.map(_.values(trains), renderTrain);
      }
    },
  }
};

const noHandlersFactory = () => {};
export const nullFactory = noHandlersFactory;
/**
 *
 * @param {function|null} getTool - a function that will return the current tool data at the time the event happens.
 * @param {string|null} targetName
 * @paaaram {function} dispatch
 * @returns {function|nullFactory} -
 */
export const getHandlersFactory = _.memoize(function makeHandlersFactory(getTool = null, { targetName = null, dispatch }) {
  if (!getTool) return noHandlersFactory;
  const tool = tools[getTool().name];
  if (!tool) return noHandlersFactory;
  if (targetName && !tool.touchTargets[targetName]) return noHandlersFactory;
  return (thing) => {
    return _.mapValues(tool.handlers, handler => event => handler.apply(getTool(), [thing, event, { dispatch }]));
  };
}, (getTool, { targetName }) => getTool().name + targetName);
