import React from 'react';

import defaultAsset from '../assets/icons/delapouite/originals/svg/000000/transparent/empty-chessboard.svg';

export default ({ asset = defaultAsset }) => (
  <use
    href={'#' + asset.id}
    width="1"
    height="1"
    transform="translate(-0.5 -0.5)"
    className="icon"
  />
);
