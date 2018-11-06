import  _ from 'lodash';
import ActionTypes from "./ActionTypes";

export function getTradesThatHappen(state) {
  // All trains that are stopped and are offering to trade.

  // All player offered trades
  return [];
}

export function executeTrades(inventories, trades) {
  return inventories;
}

export default function inventories(state = {}, action) {
  switch(action.type) {
    case ActionTypes.inventories.limit:
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || { id: action.id, contents: {}, offers: [] }),
          slotCount: action.slotCount,
          slotCapacity: action.slotCapacity,
        },
      };

    case ActionTypes.inventories.transfer:
      return executeTrades(state, getTradesThatHappen(state));

    default:
      return state;
  }
}
