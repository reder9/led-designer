import { iconPaths } from './iconPaths';

// Create SVG component function for each icon
const createIconComponent = (path) => {
  return function IconComponent(props) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
      >
        <path d={path} />
      </svg>
    );
  };
};

// Create components from paths
export const iconComponentMap = Object.entries(iconPaths).reduce((acc, [key, path]) => {
  acc[key] = createIconComponent(path);
  return acc;
}, {});

export default iconComponentMap;
