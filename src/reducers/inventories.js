import _ from 'lodash';
import ActionTypes from './ActionTypes';

import * as I from '../game/inventories';

export default function inventories(state = {}, action) {
  switch (action.type) {
    case ActionTypes.inventories.resolveTrades:
      return I.resolveTrades(state);

    default:
      return state;
  }
}
