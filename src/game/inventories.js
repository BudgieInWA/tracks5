import inventories
  from "../reducers/inventories";

export const addInventory = (inventories, { id, slotCount, slotCapacity, totalCapacity }) => ({
  ...inventories,
  [id]: {
    id: id,
    contents: {},
    offers: [],
    slotCount,
    slotCapacity,
    totalCapacity,
  },
});

export const removeInventory = (inventories, { id }) => ({
  ...inventories,
  [id]: undefined,
});

export const depositIntoInventory = (inventories, { id, contents }) => {
  return ({
    ...inventories,
    [id]: {
      ...inventories[id],
      contents: Object.entries(contents).reduce(
        (acc, [resource, amount]) => acc[resource] = (acc[resource] || 0) + amount,
        { ...inventories[id].contents }
      ),
    },
  });
};

export const withdrawFromInventory = (inventories, { id, resources }) => depositIntoInventory(inventories, {
  id,
  resources: Object.fromEntries(Object.entries(resources).map(([r, a]) => [r, -a]))
});

// export const performTrade = (inventories, { a: { id: idA, contents: contentsA }, b: { id: idB, contents: contentsB } }) =>

// export const createOffer = (inventories, { id, resources }) =>

// export const getAgreedTrades = (inventories) => TODO return matching pairs of offers

// export const resolveTrades = (inventories) => TODO return matching pairs of offers
