import _ from 'lodash';
import React from 'react';
import gridPositioned from './gridPositioned';
import { Text } from 'react-hexgrid';
import Icon from './Icon';

import pawn from '../assets/icons/lorc/originals/svg/000000/transparent/pawn.svg';

const BuildingSvg = gridPositioned(({ name, icon, ...rest }) => (
  <g className="building" {...rest}>
    <Text className="debug">{name || 'building'}</Text>
    <Icon asset={icon} />
  </g>
));

class Building extends React.PureComponent {
  static icon = pawn;

  render() {
    const { name, icon } = this.constructor;
    return <BuildingSvg {...{ name, icon, ...this.props }} />;
  }
}

export default Building;
