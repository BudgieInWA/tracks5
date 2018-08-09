

// const filoCache = ;
const activeStores = {};

export default class Store {
  constructor(state) {
    this.owner = state.owner;
    this.offers = state.offers;
    this.contents = state.contents;
    this.capacity = state.capacity;
  }
}