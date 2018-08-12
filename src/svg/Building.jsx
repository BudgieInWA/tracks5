import _ from 'lodash';
import React from 'react';
import gridPositioned from './gridPositioned';
import { Text } from 'react-hexgrid';
import Icon from './Icon';

import pawn from '../assets/icons/lorc/originals/svg/000000/transparent/pawn.svg';

class Building extends React.Component {
  static icon = pawn;

  render() {
    const { ...rest } = this.props;
    const { name, icon } = this.constructor;

    return (
      <g className="building" {...rest}>
        <Text className="debug">{name || 'building'}</Text>
        <Icon asset={icon} />
      </g>
    );
  }
}

export default gridPositioned(Building);