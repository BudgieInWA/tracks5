import _ from 'lodash';
import React from 'react';

import ActionTypes from './ActionTypes';

import { tools } from './tools';

// import Building from './Building.jsx';


export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.changeTool = this.changeTool.bind(this);
  }

  changeTool(event) {
    const { dispatch } = this.props;
    if (event.defaultPrevented) return;

    dispatch({ type: ActionTypes.toolName, toolName: event.currentTarget.value });
  }
  render() {
    const { toolName } = this.props;

    return (
      <form className="toolbar">
        {_.map(tools, (tool, id) => <label><input type="radio" name="tool" value={id} checked={id === toolName} onChange={this.changeTool} />{tool.name || id}</label>)}
      </form>
    );
  }

}