import _ from 'lodash';
import { Noise } from 'noisejs';
import { GridGenerator } from 'react-hexgrid';

import { HexUtils } from 'react-hexgrid';

import Hex from '../lib/Hex';
import TrackNetwork from '../lib/TrackNetwork';

import ActionTypes from './ActionTypes';

export const seed = Date.now().valueOf() % 100;
const rainNoise = new Noise(seed + 0);
const tempNoise = new Noise(seed + 1);

const orientation = {
  f0: 3.0 / 2.0,
  f1: 0.0,
  f2: Math.sqrt(3.0) / 2.0,
  f3: Math.sqrt(3.0),
  b0: 2.0 / 3.0,
  b1: 0.0,
  b2: -1.0 / 3.0,
  b3: Math.sqrt(3.0) / 3.0,
  startAngle: 0.0,
};
const layout = {
  origin: {
    x: 0,
    y: 0,
  },
  size: {
    x: 1,
    y: 1,
  },
  spacing: 1,
  orientation,
};

const biomesByTempThenRain = [
  ['tundra', 'shrubland', 'forest'],
  ['desert', 'grassland', 'rainforest'],
];

function getTileValues(hex) {
  const xy = HexUtils.hexToPixel(Hex.of(hex), layout);

  const rainScale = 0.1;
  const tempScale = 0.1;
  const rain = (1 + rainNoise.perlin2(xy.x * rainScale, xy.y * rainScale)) / 2;
  const temp = (1 + tempNoise.perlin2(xy.x * tempScale, xy.y * tempScale)) / 2;
  return {
    rain,
    temp,
  };
}

/**
 *
 * @param state.hex
 */
const tile = (state = {}, action) => {
  let { hex, biome, values } = state;
  if (hex === undefined) return state;

  if (values === undefined) {
    values = getTileValues(hex);
    const byRain = biomesByTempThenRain[Math.floor(values.temp * biomesByTempThenRain.length)];
    biome = byRain[Math.floor(values.rain * byRain.length)];
  }

  return {
    ...state,
    hex,
    biome,
    values,
  };
};

const notInTerrain = (state) => (hex) => !state[hex];
export default function terrain(state = {}, action) {
  let newHexes = [];
  if (action.type === ActionTypes.terrain.reveal) {
    newHexes.push(
      ..._.filter(GridGenerator.spiral(Hex.of(action.hex), action.radius || 0), notInTerrain(state))
    );
  }
  if (newHexes.length)
    return {
      ...state,
      ..._.fromPairs(_.map(newHexes, (h) => [h.toString(), tile({ hex: h.toString() }, action)])),
    };
  else return state;
}

export function revealTerrain(state, { trains, buildings }) {
  return _.reduce(
    [
      ..._.map(trains, ({ hex }) => ({
        type: ActionTypes.terrain.reveal,
        hex,
        radius: 4,
      })),
      ..._.map(buildings, ({ hex }) => ({
        type: ActionTypes.terrain.reveal,
        hex,
        radius: 3,
      })),
    ],
    terrain,
    state
  );
}

export function Tile(tile) {
  _.assign(this, {
    ...tile,
    hex: Hex.of(tile.hex),
  });
}

export function transformTerrain(terrain, state) {
  return _.mapValues(terrain, (tile) => new Tile(tile));
}
