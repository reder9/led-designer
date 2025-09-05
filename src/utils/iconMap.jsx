import React from 'react';
import { icons } from './icons';

// Create SVG component function for each icon
const createIconComponent = (iconSrc) => {
  return function IconComponent(props) {
    return (
      <img
        src={iconSrc}
        width="24"
        height="24"
        style={{ color: 'currentColor' }}
        {...props}
      />
    );
  };
};

// Create components from SVG files
export const iconComponentMap = Object.entries(icons).reduce((acc, [key, src]) => {
  acc[key] = createIconComponent(src);
  return acc;
}, {});
