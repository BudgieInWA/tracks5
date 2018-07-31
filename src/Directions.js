class Direction {
  constructor(bearing, name, vector) {
    this.bearing = bearing;
    this.name = name;

    if (vector) {
      this.p = vector.p;
      this.q = vector.q;
      this.r = vector.r;
    }
  }
}

export default {
  N: new Direction(0, 'North'),
  NE: new Direction(60, 'North East'),
  SE: new Direction(120, 'South East'),
  S: new Direction(180, 'South'),
  SW: new Direction(240, 'South West'),
  NW: new Direction(300, 'North East'),
};

