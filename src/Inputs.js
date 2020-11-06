import _ from 'lodash';
import ActionTypes from "./reducers/ActionTypes";
export const eventTypes = ['keydown', 'keyup', 'mousedown', 'mouseup', 'wheel', 'mousemove', 'contextmenu'];

/**
 * Key codes for the standard keys in the "alphanumeric section" category - the main keyboard section - as per
 * https://www.w3.org/TR/uievents-code/#key-alphanumeric-section.
 */
export const mainSectionCodes = {
  // "writing system keys"
  Backquote: !0, Backslash: !0, Backspace: !0, BracketLeft: !0, BracketRight: !0, Comma: !0, Digit0: !0, Digit1: !0,
  Digit2: !0, Digit3: !0, Digit4: !0, Digit5: !0, Digit6: !0, Digit7: !0, Digit8: !0, Digit9: !0, Equal: !0,
  IntlBackslash: !0, IntlRo: !0, IntlYen: !0, KeyA: !0, KeyB: !0, KeyC: !0, KeyD: !0, KeyE: !0, KeyF: !0, KeyG: !0,
  KeyH: !0, KeyI: !0, KeyJ: !0, KeyK: !0, KeyL: !0, KeyM: !0, KeyN: !0, KeyO: !0, KeyP: !0, KeyQ: !0, KeyR: !0,
  KeyS: !0, KeyT: !0, KeyU: !0, KeyV: !0, KeyW: !0, KeyX: !0, KeyY: !0, KeyZ: !0, Minus: !0, Period: !0, Quote: !0,
  Semicolon: !0, Slash: !0,
  // "functional keys"
  AltLeft: !0, AltRight: !0, CapsLock: !0, ContextMenu: !0, ControlLeft: !0, ControlRight: !0, Enter: !0, MetaLeft: !0,
  MetaRight: !0, ShiftLeft: !0, ShiftRight: !0, Space: !0, Tab: !0,
};
// After statically assigning the document keys (for linters etc.), set the values.
_.each(mainSectionCodes, (b, code) => mainSectionCodes[code] = code);

export const mouseButtons = { Left: 0, Middle: 1, Right: 2, Four: 3, Five: 4, WheelDown: 'WheelDown', WheelUp: 'WheelUp' };


/** Maps `key` or `code` to "input" (state key) name. */
const binaryStateInputKeys = {};
/** Maps `key` or `code` to "input" (state key) name and "action" name. */
const statefulInputKeys = {};
/** A list of "mousemove" actions. */
const mouseMoveActions = [];

export function getHandler({ dispatch }) {
  function resolveEvent(event) {
    if (event.type === 'contextmenu') return true; // TODO treat as a sort of "click" along with other mouse buttons ?
    if (event.type === 'mousemove') {
      _.each(mouseMoveActions, action => action(event));
      return false;
    }

    if ((event.type === 'keydown' && !event.repeat) || event.type === 'keyup' || event.type === 'mousedown' || event.type === 'mouseup') {
      const input = binaryStateInputKeys[event.key] || binaryStateInputKeys[event.code] || binaryStateInputKeys[event.button] || null;
      if (input) {
        dispatch({
          type: ActionTypes.inputs[event.type.substr(-4) === 'down' ? 'on' : 'off'],
          input,
        });
        return true;
      }
    }

    if (event.type === 'keydown' || event.type === 'wheel') {
      const { input, action } = event.type === 'wheel'
        ? statefulInputKeys[event.deltaY > 0 ? mouseButtons.WheelDown : mouseButtons.WheelUp] || {}
        : statefulInputKeys[event.key] || statefulInputKeys[event.code] || {};
      if (input) {
        dispatch({
          type: ActionTypes.inputs.stateAction,
          input,
          name: action,
        });
        return true;
      }
    }
  }

  return function handleKeyInput(event) {
    event.type === 'mousemove' || console.debug(event.type, event);
    if (resolveEvent(event) || mainSectionCodes[event.code]) { // TODO only do other checks if resolve event doesn't return.
      event.preventDefault();
    }
  }
}

/**
 * Make a reducer package for an simple two state input.
 *
 * @param {string} name - the name of the input
 * @param {string[]} keys - The default keys, identified by `code` or `key`
 * @returns {function(boolean?, object): boolean} - The reducer function for the input state.
 */
export function makeBinaryStateInput(name, { keys }) {
  _.each(keys, k => {
    binaryStateInputKeys[k] = name
  });

  return (state = false, action) => {
    if (action.type === ActionTypes.inputs.on  && action.input === name) return true;
    if (action.type === ActionTypes.inputs.off && action.input === name) return false;
    return state;
  };
}

/**
 * Register inputs and make a reducer for a multi-state "input".
 *
 * @param {string} name - The name of the input.
 * @param {*} initialState
 * @param {object<string, {action: function(*): *, keys: string[]}>} actions - Maps action names to the transformation and default keys.
 * @returns {function(*?, object): *} - The reducer function for the input state.
 */
export function makeStatefulInput(name, initialState, actions)  {
  _.each(actions, ({ keys }, actionName) => {
    _.each(keys, k => {
      statefulInputKeys[k] = { input: name, action: actionName };
    });
  });

  return (state = initialState, action) => {
    if (action.type === ActionTypes.inputs.stateAction && action.input === name) {
      return actions[action.name].action(state);
    }
    return state;
  };
}
