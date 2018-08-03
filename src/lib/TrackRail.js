import _ from "lodash";

import Hex from './Hex';
import CardinalDirection from './CardinalDirection';

export default class TrackRail {
  /**
   *
   * @param {string} edge.v
   * @param {string} edge.w
   * @param data
   */
  constructor(edge, data) {
    this.v = Hex.of(edge.v);
    this.w = Hex.of(edge.w);
    this.direction = CardinalDirection.of(data[edge.v].direction);
    // console.log({dataDir: _.values(data)[1].direction, dir: this.direction})
    // ...
  }

  /**
   * @param {Hex} hex - One of `this.v` or `this.w`.
   * @returns {Hex} - The other.
   */
  otherEnd(hex) {
    return this.w !== hex  ? this.w : this.v;
  }
}

