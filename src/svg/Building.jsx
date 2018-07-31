import _ from 'lodash';
import React from 'react';
import gridPositioned from './gridPositioned';
import { Text } from 'react-hexgrid';
import Icon from './Icon';

class Building extends React.Component {
  render() {
    const { name } = this.props;

    return (
      <g className="building">
        <Text className="debug">{name || 'building'}</Text>
        <Icon />
      </g>
    );
  }
}

export default gridPositioned(Building);