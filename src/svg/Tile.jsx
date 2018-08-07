import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import gridPositioned from './gridPositioned';

class Tile extends React.Component {
  static propTypes = {
    className: PropTypes.string,

    data: PropTypes.object,
    onMouseEnter: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragOver: PropTypes.func,
    onDrop: PropTypes.func,
    children: PropTypes.node
  };

  static contextTypes = {
    points: PropTypes.string
  };

  // onDragStart(e) {
  //   if (this.props.onDragStart) {
  //     const targetProps = {
  //       ...this.state,
  //       data: this.props.data,
  //       fill: this.props.fill,
  //       className: this.props.className
  //     };
  //     e.dataTransfer.setData('hexagon', JSON.stringify(targetProps));
  //     this.props.onDragStart(e, this);
  //   }
  // }
  // onDragEnd(e) {
  //   if (this.props.onDragEnd) {
  //     e.preventDefault();
  //     const success = (e.dataTransfer.dropEffect !== 'none');
  //     this.props.onDragEnd(e, this, success);
  //   }
  // }
  // onDragOver(e) {
  //   if (this.props.onDragOver) {
  //     this.props.onDragOver(e, this);
  //   }
  // }
  // onDrop(e) {
  //   if (this.props.onDrop) {
  //     e.preventDefault();
  //     const target = JSON.parse(e.dataTransfer.getData('hexagon'));
  //     this.props.onDrop(e, this, target);
  //   }
  // }
  render() {
    const { className, values, biome, ...rest } = this.props;
    const { points } = this.context;
    return (
      <g className={classNames('tile', biome, className)}>
        <polygon points={points} {...rest} />
        {this.props.children}
      </g>
    );
  }
}

export default gridPositioned(Tile);
