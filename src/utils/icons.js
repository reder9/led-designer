// Import all SVG icons using Vite's glob import
const socialIcons = import.meta.glob('../assets/icons/social/*.svg', { eager: true });
const streamingIcons = import.meta.glob('../assets/icons/streaming/*.svg', { eager: true });
const gamingIcons = import.meta.glob('../assets/icons/gaming/*.svg', { eager: true });
const sportsIcons = import.meta.glob('../assets/icons/sports/*.svg', { eager: true });

// Helper function to process icon modules
const processIcons = iconModules => {
  const processed = {};
  for (const path in iconModules) {
    const iconName = path.split('/').pop().replace('.svg', '');
    processed[iconName] = iconModules[path].default;
  }
  return processed;
};

// Export icons by category
export const iconsByCategory = {
  social: processIcons(socialIcons),
  streaming: processIcons(streamingIcons),
  gaming: processIcons(gamingIcons),
  sports: processIcons(sportsIcons),
};

// Combined icons object for backward compatibility
export const icons = {
  ...iconsByCategory.social,
  ...iconsByCategory.streaming,
  ...iconsByCategory.gaming,
  ...iconsByCategory.sports,
};
