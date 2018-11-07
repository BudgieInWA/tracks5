import { combineReducers } from 'redux';

import { makeStatefulInput, makeBinaryStateInput, mainSectionCodes, mouseButtons } from '../Inputs';

const up = makeBinaryStateInput('up', { keys: [mainSectionCodes.KeyW, 'ArrowUp'] });
const left = makeBinaryStateInput('left', { keys: [mainSectionCodes.KeyA, 'ArrowLeft'] });
const down = makeBinaryStateInput('down', { keys: [mainSectionCodes.KeyS, 'ArrowDown'] });
const right = makeBinaryStateInput('right', { keys: [mainSectionCodes.KeyD, 'ArrowRight'] });

const mousePan = makeBinaryStateInput('mousePan', { keys: [mouseButtons.Right] });
//TODO mousemove business
// const mouseMove = makeEventInput('mouseMove');

const zoomScale = makeStatefulInput('zoomScale', 7, {
  in: {
    action: (zoomScale) => Math.max(1, zoomScale - 1),
    keys: [mainSectionCodes.Equal, mouseButtons.WheelUp],
  },
  out: {
    action: (zoomScale) => Math.min(10, zoomScale + 1),
    keys: [mainSectionCodes.Minus, mouseButtons.WheelDown],
  },
});

const inputs = combineReducers({ up, left, down, right, zoomScale });

export function getInputs(state) {
  return state.inputs;
}

export default inputs;
