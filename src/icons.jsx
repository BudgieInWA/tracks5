import _ from 'lodash';
import React from 'react';

const iconConfig = {
  Home: 'delapouite/originals/hut',
};

const renderAllIconSymbols = () => {
  return (
    <svg>
      {_.map(iconConfig, (id, name) => {
        const svg = require('./assets/icons/' + id).default;
        console.log(svg);
        return <symbol key={name} id={id} />;
      })}
    </svg>
  )
};

const icons = _.map(iconConfig, (id) => {
  return () => <use href={`#${id}`} />;
});

export default {
  IconSymbols: renderAllIconSymbols,
  ...icons
}