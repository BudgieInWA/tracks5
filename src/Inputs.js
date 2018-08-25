import _ from 'lodash';
import ActionTypes from "./reducers/ActionTypes";
export const eventTypes = ['keydown', 'keyup'];

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


/** Maps `key` or `code` to "input" (state key) name. */
const binaryStateInputKeys = {};
/** Maps `key` or `code` to "input" (state key) name and "action" name. */
const statefulInputKeys = {};

export function getHandler({ dispatch }) {
  function resolveEvent(event) {
    if ((event.type === 'keydown' && !event.repeat) || event.type === 'keyup') {
      const input = binaryStateInputKeys[event.key] || binaryStateInputKeys[event.code] || null;
      if (input) {
        dispatch({
          type: ActionTypes.inputs[event.type === 'keydown' ? 'on' : 'off'],
          input,
        });
      }
    }

    if (event.type === 'keydown') {
      const { input, action } = statefulInputKeys[event.key] || statefulInputKeys[event.code] || {};
      if (input) {
        dispatch({
          type: ActionTypes.inputs.stateAction,
          input,
          name: action,
        });
      }
    }
  }

  return function handleKeyInput(event) {
    if (resolveEvent(event) || mainSectionCodes[event.code]) {
      event.preventDefault();
    }
  }
}

/**
 * Make a reducer package for an simple two state input.
 *
 * @param {string} name - the name of the input
 * @param {string[]} keys - The default keys, identified by `code` or `key`
 * @returns {function([object], object): object} - The reducer function for the input state.
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
 * @param {object<string, {action: function(*), keys: string[]}>} actions - Maps action names to the transformation and default keys.
 * @returns {function([object], object): object} - The reducer function for the input state.
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
