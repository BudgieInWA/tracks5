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
  }

  ensureIsEnd(hex) {
    if (hex !== this.v && hex !== this.w) {
      throw TypeError(`'hex' must be one of the ends of this rail: ${this.v}, or ${this.w}`);
    }
  }

  /**
   * @param {Hex} hex - One of `this.v` or `this.w`.
   * @returns {Hex} - The other.
   */
  otherEnd(hex) {
    this.ensureIsEnd(hex);
    return this.w !== hex  ? this.w : this.v;
  }

  /**
   * @param {Hex} hex - One of `this.v` or `this.w`.
   * @returns {CardinalDirection} - The direction along the rail from hex.
   */
  from(hex) {
    this.ensureIsEnd(hex);
    return hex === this.v ? this.direction : this.direction.opposite;
  }
}

