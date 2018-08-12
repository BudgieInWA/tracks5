import React from 'react';

import defaultAsset from '../assets/icons/delapouite/originals/svg/000000/transparent/empty-chessboard.svg';

export default ({asset=defaultAsset}) => <use
  href={'#' + asset.id }
  width="7"
  height="7"
  transform="translate(-3.5 -3.5)"
  className="icon"
/>;
