import React from 'react';

import hut from '../assets/icons/lorc/originals/svg/000000/transparent/pawn.svg';

export default ({asset=hut}) => <use
  href={'#' + asset.id }
  width="7"
  height="7"
  transform="translate(-3.5 -3.5)"
  className="icon"
/>;
