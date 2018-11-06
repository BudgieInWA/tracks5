
export default class Inventory {
  constructor(state) {
    Object.assign(this, state);
  }

  toString() {
    return `${this.id} (${this.slotCount} x ${this.slotCapacity})`
  }
}