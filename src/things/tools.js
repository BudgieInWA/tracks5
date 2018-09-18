import _ from 'lodash';
import ActionTypes from "../reducers/ActionTypes";

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
  },

  building: {
    touchTargets: { tile: true },
    getOptions() {
      // TODO...
    },
    handlers: {
      onClick({ hex }, event, { dispatch }) {
        dispatch({ type: ActionTypes.buildings.build, hex, building: this.option || 'Station' });
      },
    },
  },

  train: {
    touchTargets: { track: true },
    getOptions() {
      // TODO...
    },
    handlers: {
      onClick(rail, event, { dispatch }) {
        dispatch({ type: ActionTypes.trains.build, hex: rail.v, direction: rail.direction });
      },
    },
  },

  controlTrain: {
    touchTargets: { tile: true },
    stateToOptions: (state) => _.keys(state.game.trains),
    handlers: {
      onClick({ hex }, event, { dispatch }) {
        dispatch({ type: ActionTypes.train.goto, id: this.option, hex: hex.toString() })
      }
    }
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
