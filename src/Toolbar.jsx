import _ from 'lodash';
import React from 'react';

import ActionTypes from './ActionTypes';

import { tools } from './tools';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.changeTool = this.changeTool.bind(this);
  }

  changeTool(event) {
    const { dispatch } = this.props;
    if (event.defaultPrevented) return;

    dispatch({ type: ActionTypes.tool.name, name: event.currentTarget.value });
  }
  render() {
    const { tool: { name } } = this.props;

    return (
      <form className="toolbar">
        {_.map(tools, (tool, id) => <label key={id}><input type="radio" name="tool" value={id} checked={id === name} onChange={this.changeTool} />{tool.name || id}</label>)}
      </form>
    );
  }

}