import ActionTypes from "./reducers/ActionTypes";

export const tools = {
  poke: {
    onClick({ hex }, event) {
      console.info('Poke!', hex);
    }
  },

  track: {
    onClick({ hex }, event) {
      const { tool: { hexes }, dispatch } = this.props;
      if (hexes.length === 0) {
        dispatch({ type: ActionTypes.tool.hexes.start, hex });
      } else {
        dispatch({ type: ActionTypes.tracks.build, hexes });
        dispatch({ type: ActionTypes.tool.hexes.clear });
      }
    },
    onMouseEnter({ hex }, event) {
      const { tool: { hexes }, dispatch } = this.props;
      if (hexes.length > 0) {
        dispatch({ type: ActionTypes.tool.hexes.end, hex });
      }
    },

    // onDragStart(event, hexComponent) {
    //   const { state: { hex } } = hexComponent;
    //   this.props.dispatch({ type: ActionTypes.path.start, hex });
    // },;
    // onDragOver(event, hexComponent)  {
    //   const { state: { hex } } = hexComponent;
    //   this.props.dispatch({ type: ActionTypes.path.end, hex });
    // },
    // onDrop(event, hexComponent, droppedHexComponent) {
    //   this.props.dispatch({ type: ActionTypes.path.clear });
    // },
  },
  building: {},
};

export const getTool = id => tools[id] || {};
