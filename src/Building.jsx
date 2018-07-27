import _ from 'lodash';
import React from 'react';
import { Hexagon, Text, Hex } from 'react-hexgrid';

export default class Building extends React.Component {
  render() {
    const { hex, name } = this.props;

    return (
      <Hexagon {...hex}>
        <Text>{name || 'building'}</Text>
      </Hexagon>
    );
  }
}