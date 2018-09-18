import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import JSONTree from 'react-json-tree';

import ActionTypes from "./reducers/ActionTypes";
import { getTool } from "./reducers/tool";

import { tools } from "./things/tools";

const pokeItemStringer = (type, data, itemType, itemString) => {
  switch (type) {
    case 'Object':
      return (
        <span>
          <span style={{opacity: 0.7}}>{data.constructor.name} {`{${itemString.split(' ')[0]}}`}</span>
          &nbsp;
          {data.constructor.name === 'Object' ? undefined : `"${data.toString()}"`}
        </span>
      );

    default:
      return <span>{type} {itemType} {itemString}</span>;

  }
};
const pokeJsonTheme = {
  scheme: 'tomorrow',
  author: 'chris kempson (http://chriskempson.com)',
  base00: '#1d1f21',
  base01: '#282a2e',
  base02: '#373b41',
  base03: '#969896',
  base04: '#b4b7b4',
  base05: '#c5c8c6',
  base06: '#e0e0e0',
  base07: '#ffffff',
  base08: '#cc6666',
  base09: '#de935f',
  base0A: '#f0c674',
  base0B: '#b5bd68',
  base0C: '#8abeb7',
  base0D: '#81a2be',
  base0E: '#b294bb',
  base0F: '#a3685a'
};

class ToolUI extends React.Component {
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
    const { state, tool: { name, poke, option } } = this.props;

    const tool = tools[name];
    const options = tool.stateToOptions && tool.stateToOptions(state);
    return (
      <React.Fragment>
        <aside className="toolpanel">
          {poke && <JSONTree data={poke} theme={pokeJsonTheme} getItemString={pokeItemStringer} />}
        </aside>
        <form className="toolbar">
          <fieldset>
            {_.map(tools, (tool, id) => (
              <label key={id}>
                <input type="radio" name="tool" value={id} checked={id === name} onChange={this.changeTool} />
                {tool.name || id}
              </label>
            ))}
          </fieldset>
          {options &&
            <fieldset className="option">
              {_.map(options, o => (
                <label key={o}>
                  <input type="radio" name="option" value={o} checked={o === option} onChange={this.changeOption} />
                  {o}
                </label>
              ))}
            </fieldset>
          }
        </form>
      </React.Fragment>
    );
  }
}

export default connect(s => ({ tool: getTool(s), state: s }))(ToolUI);