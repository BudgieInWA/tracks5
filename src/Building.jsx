import _ from 'lodash';
import React from 'react';
import { Hexagon, Text, Hex } from 'react-hexgrid';

import Icon from './Icon';

export default class Building extends React.Component {
  render() {
    const { hex, name } = this.props;

    return (
      <Hexagon {...hex}>
        <Text className="debug">{name || 'building'}</Text>
        <Icon />
      </Hexagon>
    );
  }
}