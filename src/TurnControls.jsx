import _ from "lodash";
import React from "react";
import { connect } from "react-redux";

import ActionTypes from "./reducers/ActionTypes";


let timer;
const turnActions = dispatch => ({
  doMovePhase(event) {
    dispatch({ type: ActionTypes.game.movePhase })
  },
  start(event) {
    clearTimeout(timer);
    timer = setInterval(() => {
      dispatch({ type: ActionTypes.game.movePhase })
    }, 1000);
  },
  stop(event) {
    clearTimeout(timer);
  },
});
class TurnControls extends React.Component {
  render() {
    const { ...actions } = this.props;
    return (
      <form className="turn-controls">
        {_.map(actions, (action, name) => <button key={name} type="button" onClick={action}>{name}</button>)}
      </form>
    );
  }
}

export default connect(null, turnActions)(TurnControls);