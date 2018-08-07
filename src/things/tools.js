import ActionTypes from "../reducers/ActionTypes";

//TODO classify
export const tools = {
  poke: {
    touchTargets: { tile: true, building: true, track: true, train: true },
    onClick({ hex }, event) {
      console.info('Poke!', { hex, event });
    }
  },

  track: {
    touchTargets: { tile: true },
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

  building: {
    touchTargets: { tile: true },
    getOptions() {
      // TODO...
    },
    onClick({ hex }, event) {
      let { tool: { option }, dispatch } = this.props;
      option = 'Station';
      dispatch({ type: ActionTypes.buildings.build, hex, building: option });
    }
  },

  train: {},
};

export const getToolImpl = id => tools[id] || {};