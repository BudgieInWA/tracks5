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
    case ActionTypes.inventories.add:
      return {
        ...state,
        [action.id]: {
          id: action.id,
          contents: {},
          offers: [],
          slotCount: action.slotCount,
          slotCapacity: action.slotCapacity,
        },
      };

    case ActionTypes.inventories.insert:
      const { id, resource: [amount, type] } = action;
      const inv = state[id] || {};
      return {
        ...state,
        [id]: { ...inv, [type]: inv[type] + amount }
      };

    case ActionTypes.inventories.doTrades:
      return executeTrades(state, getTradesThatHappen(state));

    default:
      return state;
  }
}

