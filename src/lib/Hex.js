import _ from 'lodash';

export default class Hex {
  static origin = new Hex(0, 0, 0);

  constructor(q, r, s) {
    this.q = q;
    this.r = r;
    this.s = s;

    // Object.freeze(this); // TODO: safe?
  }

  static of(hexLike) {
    if (!hexLike) return null;
    if (hexLike instanceof Hex) return hexLike;
    const type = typeof hexLike;
    if (type === typeof '') return new Hex(...hexLike.split(', ').map((s) => parseInt(s)));
    if (type === typeof {}) return new Hex(hexLike.q, hexLike.r, hexLike.s);
    if (type === typeof []) return new Hex(...hexLike);
    console.warn("Don't know the Hex of", hexLike);
    return null;
  }

  toString() {
    return `${this.q}, ${this.r}, ${this.s}`;
  }
}
