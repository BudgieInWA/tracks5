import station from '../assets/icons/delapouite/originals/svg/000000/transparent/virtual-marker.svg';
import tree from '../assets/icons/cathelineau/originals/svg/000000/transparent/holy-oak.svg';

import Building from '../svg/Building';

export class Station extends Building {
  static icon = station;

  constructor({ team, inventory }) {
    super();

    this.team = team;
    this.inventory = inventory;
  }
}

export class LumberYard extends Building {
  static icon = tree;

  constructor({ team, inventory }) {
    super();

    this.team = team;
    this.inventory = inventory;
  }
}
