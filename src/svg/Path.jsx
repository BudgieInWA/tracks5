import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HexUtils } from 'react-hexgrid';

class Path extends Component {
  static propTypes = {
    hexes: PropTypes.array,
    layout: PropTypes.object,
  };
  static contextTypes = {
    layout: PropTypes.object // TODO Shape
  };

  // TODO Refactor
  getPointsString() {
    let { hexes } = this.props;
    const { layout } = this.context;

    if (!hexes) return '';
    if (hexes.length === 1) hexes = [hexes[0], hexes[0]];

    // Construct Path points out of all the intersecting hexes (e.g. M 0,0 L 10,20, L 30,20)
    let points = 'M';
    points += hexes.map(hex => {
      let p = HexUtils.hexToPixel(hex, layout);
      return ` ${p.x},${p.y} `;
    }).join('L');

    return points;
  }

  render() {
    const { hexes, ...rest } = this.props;
    return (
      <path {...rest} d={this.getPointsString()} />
    );
  }
}

export default Path;
