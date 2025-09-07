import React from 'react';

// Dynamically import all SVG files from each category folder
const socialIcons = import.meta.glob('../assets/icons/social/*.svg', { eager: true });
const gamingIcons = import.meta.glob('../assets/icons/gaming/*.svg', { eager: true });
const sportsIcons = import.meta.glob('../assets/icons/sports/*.svg', { eager: true });

// Helper function to extract icon name from file path
const getIconName = (path) => {
  return path.split('/').pop().replace('.svg', '');
};

// Create SVG component that renders the imported SVG
const createSVGComponent = (svgUrl, iconName) => {
  return function SVGComponent(props) {
    return (
      <img
        src={svgUrl}
        alt={iconName}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          ...props.style
        }}
        {...props}
      />
    );
  };
};

// Process all icon imports into a single map
const processIcons = (iconModules) => {
  const processed = {};
  for (const path in iconModules) {
    const iconName = getIconName(path);
    const svgUrl = iconModules[path].default;
    processed[iconName] = createSVGComponent(svgUrl, iconName);
  }
  return processed;
};

// Create components from all SVG imports automatically
export const iconComponentMap = {
  ...processIcons(socialIcons),
  ...processIcons(gamingIcons),
  ...processIcons(sportsIcons),
};

export default iconComponentMap;
