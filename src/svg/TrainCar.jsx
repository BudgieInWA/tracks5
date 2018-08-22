import React from "react";
import gridPositioned from "./gridPositioned";
import { HexUtils, Text } from "react-hexgrid";

import { SEGMENTS } from '../reducers/trains';

const Car = gridPositioned(({ hex, direction, targetSpeed, bearing, name, ...rest }) => (
    <g className="train" {...rest} transform={`rotate(${bearing}) translate(-0.1, 0) scale(0.7) ` } >
      <path d="M 0,0.5  L 0,0" />
      <path className="overlay" d="M 0,0.5  L 0,0" />
      <Text className="debug">{name || 'train'}</Text>
    </g>
  )
);

export default class TrainCar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      bearing: props.direction.bearing,
    }
  }

  componentWillReceiveProps({ direction }) {
    // The animation will go through the bearing numbers, so we control the sign of diff to choose the rotation direction.
    let diff = direction.bearing - (this.state.bearing % 360);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    this.setState({ bearing: this.state.bearing + diff });
  }

  render() {
    const { hex, direction, distance, ...rest } = this.props;
    return (
      <Car {...this.props} hex={HexUtils.add(hex, HexUtils.multiply(direction, distance / SEGMENTS ))} bearing={this.state.bearing} />
    );
  }
}
