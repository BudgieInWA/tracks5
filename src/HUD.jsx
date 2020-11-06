import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import TurnControls from './TurnUI';

import ActionTypes from './reducers/ActionTypes';
import { getTool } from './reducers/tool';

import { tools } from './things/tools';

class HUD extends React.Component {
  constructor(props) {
    super(props);

    this.changeTool = this.changeTool.bind(this);
    this.changeOption = this.changeOption.bind(this);
  }

  changeTool(event) {
    const { dispatch } = this.props;
    dispatch({ type: ActionTypes.tool.name, name: event.currentTarget.value });
  }

  changeOption(event) {
    const { dispatch } = this.props;
    dispatch({ type: ActionTypes.tool.option, option: event.currentTarget.value });
  }

  render() {
    const {
      state,
      tool: { name, option },
    } = this.props;

    const tool = tools[name];
    const options = tool.stateToOptions && tool.stateToOptions(state);
    return (
      <React.Fragment>
        <aside className="toolpanel">{tool.renderHud && tool.renderHud(state)}</aside>

        <form className="toolbar">
          <fieldset>
            {_.map(tools, (tool, id) => (
              <label key={id}>
                <input
                  type="radio"
                  name="tool"
                  value={id}
                  checked={id === name}
                  onChange={this.changeTool}
                />
                {tool.name || id}
              </label>
            ))}
          </fieldset>

          {options && (
            <fieldset className="option">
              {_.map(options, (o, id) => (
                <label key={id}>
                  <input
                    type="radio"
                    name="option"
                    value={id}
                    checked={id === '' + option}
                    onChange={this.changeOption}
                  />
                  {o}
                </label>
              ))}
            </fieldset>
          )}
        </form>

        <TurnControls />
      </React.Fragment>
    );
  }
}

export default connect((s) => ({ tool: getTool(s), state: s }))(HUD);
