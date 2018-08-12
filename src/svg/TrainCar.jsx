import React from "react";
import gridPositioned from "./gridPositioned";
import { HexUtils, Text } from "react-hexgrid";

import { SEGMENTS } from '../reducers/trains';

const Car = gridPositioned(({ direction, name }) => (
    <g className="train" transform={`rotate(${direction.bearing}) translate(-1, 0)`}>
      <path d="M 0,2  L 0,0" />
      <Text className="debug">{name || 'train'}</Text>
    </g>
  )
);

export default class TrainCar extends React.Component {
  render() {
    const { hex, direction, distance, ...rest } = this.props;
    return (
      <Car {...this.props} hex={HexUtils.add(hex, HexUtils.multiply(direction, distance / SEGMENTS ))} />
    );
  }
}
