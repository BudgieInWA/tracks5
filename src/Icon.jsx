import React from 'react';

import hut from './assets/icons/delapouite/originals/svg/000000/transparent/hut.svg';

console.log({hut});
export default (asset=hut) => <use {...{ 'xlink:href': '#' + asset.id }} />;
