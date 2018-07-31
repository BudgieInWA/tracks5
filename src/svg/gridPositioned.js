import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { HexUtils } from 'react-hexgrid';

export default function gridPositioned(Component) {
  return class extends React.Component {
    static propTypes = {
      hex: PropTypes.object.isRequired,
    };

    static contextTypes = {
      layout: PropTypes.object, // TODO Shape
    };

    render() {
      const { hex, ...rest } = this.props;
      const { layout } = this.context;
      const pixel = HexUtils.hexToPixel(hex, layout);
      return (
        <g className={classNames('grid-positioned')} transform={`translate(${pixel.x}, ${pixel.y})`}>
          <Component {...rest} />
        </g>
      );
    }
  }
}
