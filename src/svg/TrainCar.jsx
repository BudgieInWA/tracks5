import React from "react";
import gridPositioned from "./gridPositioned";
import { Text } from "react-hexgrid";

class TrainCar extends React.Component {
  render() {
    const { name, direction } = this.props;

    return (
      <g className="train">
        <Text className="debug">{name || 'building'}</Text>
        <rect x="-2" y="-2" width="2" height="4" transform={`rotate(${direction.bearing})`} />
      </g>
    );
  }
}

export default gridPositioned(TrainCar);