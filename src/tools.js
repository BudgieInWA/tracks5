import ActionTypes from './ActionTypes';

export const tools = {
  poke: {
    onClick(event, hexComponent) {
      const { state: { hex } } = hexComponent;
      console.log(hex)
    }
  },

  line: {
    onClick(event, hexComponent) {
      const { path, dispatch } = this.props;
      const { state: { hex } } = hexComponent;
      if (path.length === 0) {
        dispatch({ type: ActionTypes.path.start, hex });
      } else {
        dispatch({ type: ActionTypes.path.clear });
      }
    },
    onMouseEnter(event, hexComponent) {
      const { path, dispatch } = this.props;
      const { state: { hex } } = hexComponent;
      if (path.length > 0) {
        dispatch({ type: ActionTypes.path.end, hex });
      }
    },

    onDragStart(event, hexComponent) {
      const { state: { hex } } = hexComponent;
      this.props.dispatch({ type: ActionTypes.path.start, hex });
    },
    onDragOver(event, hexComponent)  {
      const { state: { hex } } = hexComponent;
      this.props.dispatch({ type: ActionTypes.path.end, hex });
    },
    onDrop(event, hexComponent, droppedHexComponent) {
      this.props.dispatch({ type: ActionTypes.path.clear });
    },
  },
  building: {},
};

export const getTool = id => tools[id] || {};
