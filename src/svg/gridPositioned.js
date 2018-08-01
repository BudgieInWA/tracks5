import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Hex, HexUtils } from "react-hexgrid";

export default function gridPositioned(Component) {
  return class extends React.Component {
    static displayName = 'GridPositioner';

    static propTypes = {
      hex: PropTypes.object.isRequired,
    };

    static contextTypes = {
      layout: PropTypes.object,
    };

    render() {
      const { hex = Hex.origin, ...rest } = this.props;
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
