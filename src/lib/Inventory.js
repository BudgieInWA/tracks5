

// const filoCache = ;
// _.memoize()

export default class Inventory {
  constructor(state) {
    this.owner = state.owner;
    this.offers = state.offers;
    this.contents = state.contents;
    this.capacity = state.capacity;
  }
}