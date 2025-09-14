import React from 'react';

// Dynamically import all SVG files from each category folder as text/raw content
const socialIcons = import.meta.glob('../assets/icons/social/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const gamingIcons = import.meta.glob('../assets/icons/gaming/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const sportsIcons = import.meta.glob('../assets/icons/sports/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

// Helper function to extract icon name from file path
const getIconName = path => {
  return path.split('/').pop().replace('.svg', '');
};

// Create SVG component that renders inline SVG content
const createSVGComponent = (svgContent, _iconName) => {
  return function SVGComponent(props) {
    // Ensure proper SVG attributes for scaling and aspect ratio preservation
    let processedSVG = svgContent
      .replace(
        '<svg',
        `<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="max-width: 100%; max-height: 100%; display: block; overflow: visible;"`
      )
      .replace(/width="[^"]*"/g, '') // Remove original width
      .replace(/height="[^"]*"/g, ''); // Remove original height

    // Only add a default viewBox if one doesn't exist
    if (!processedSVG.includes('viewBox=')) {
      processedSVG = processedSVG.replace('<svg', '<svg viewBox="0 0 24 24"');
    }

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible', // Allow SVG to show fully
          position: 'relative',
          ...props.style,
        }}
        dangerouslySetInnerHTML={{
          __html: processedSVG,
        }}
        {...props}
      />
    );
  };
};

// Process all icon imports into a single map
const processIcons = iconModules => {
  const processed = {};
  for (const path in iconModules) {
    const iconName = getIconName(path);
    const svgContent = iconModules[path]; // Now this is the raw SVG content
    processed[iconName] = createSVGComponent(svgContent, iconName);
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
