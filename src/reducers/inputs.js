import { combineReducers } from 'redux';

import { makeStatefulInput, makeBinaryStateInput, mainSectionCodes } from '../Inputs';

const up = makeBinaryStateInput('up', { keys: [mainSectionCodes.KeyW] });
const left = makeBinaryStateInput('left', { keys: [mainSectionCodes.KeyA] });
const down = makeBinaryStateInput('down', { keys: [mainSectionCodes.KeyS] });
const right = makeBinaryStateInput('right', { keys: [mainSectionCodes.KeyD] });

const zoomScale = makeStatefulInput('zoomScale', 7, {
  in: {
    action: (zoomScale) => Math.min(10, zoomScale - 1),
    keys: [mainSectionCodes.Equal],
  },
  out: {
    action: (zoomScale) => Math.max(1, zoomScale + 1),
    keys: [mainSectionCodes.Minus],
  },
});

const inputs = combineReducers({ up, left, down, right, zoomScale });

export function getInputs(state) {
  return state.inputs;
}

export default inputs;
