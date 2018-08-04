import React from 'react';
import station from '../assets/icons/delapouite/originals/svg/000000/transparent/virtual-marker.svg';

import SvgBuilding from '../svg/Building';

class Building extends React.Component {
  // static of({ type, ...state }) {
  //   return new
  // }

  render() {
    const { icon, name } = this.constructor;
    const { hex } = this.props;
    return (
      <SvgBuilding icon={icon} hex={hex} name={name}>
        {this.renderChildren()}
      </SvgBuilding>
    );
  }

  renderChildren() {
    return null;
  }
}

export class Station extends Building {
  static icon = station;

  constructor ({ team, store }) {
    super();

    this.team = team;
    this.store = store;
  }

}