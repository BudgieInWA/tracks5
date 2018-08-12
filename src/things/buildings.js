import React from 'react';
import station from '../assets/icons/delapouite/originals/svg/000000/transparent/virtual-marker.svg';

import Building from '../svg/Building';

export class Station extends Building {
  static icon = station;

  constructor ({ team, store }) {
    super();

    this.team = team;
    this.store = store;
  }

}