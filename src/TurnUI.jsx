import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import ActionTypes from './reducers/ActionTypes';
import { seed } from './reducers/terrain';

let timer;
const turnActions = (dispatch) => ({
  advance(event) {
    dispatch({ type: ActionTypes.game.turnResolve });
  },
  play(event) {
    clearTimeout(timer);
    timer = setInterval(() => {
      dispatch({ type: ActionTypes.game.turnResolve });
    }, 990);
  },
  stop(event) {
    clearTimeout(timer);
  },
});

// TODO allow selection of feature flags for css behaviour and other stuff:
// const features = {
//   tracksAsRoads: false,
//   showSteps: true,
// };
// <section>
//   {_.map(features, (on, f) => <checkbox onChange={})}
// </section>

class TurnUI extends React.Component {
  componentDidMount() {
    this.props.play();
  }

  render() {
    const { ...actions } = this.props;
    return (
      <form className="turn-controls">
        <code>{seed}</code>
        {_.map(actions, (action, name) => (
          <button key={name} type="button" onClick={action}>
            {name}
          </button>
        ))}
        {/*<button><pre>`</pre></button>*/}
      </form>
    );
  }
}

export default connect(null, turnActions)(TurnUI);
