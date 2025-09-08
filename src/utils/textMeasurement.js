/**
 * Text measurement utilities for dynamic text box sizing
 */

/**
 * Measure text dimensions using canvas
 * @param {string} text - The text to measure
 * @param {number} fontSize - Font size in pixels
 * @param {string} fontFamily - Font family name
 * @param {string} fontWeight - Font weight (normal, bold, etc.)
 * @param {string} fontStyle - Font style (normal, italic, etc.)
 * @returns {Object} - {width, height} dimensions
 */
export const measureTextDimensions = (
  text,
  fontSize,
  fontFamily,
  fontWeight = 'normal',
  fontStyle = 'normal'
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set font properties
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

  // Split text into lines
  const lines = text.split('\n');
  const lineHeight = fontSize * 1.2; // Standard line height multiplier

  // Measure each line and find the maximum width
  let maxWidth = 0;
  lines.forEach(line => {
    const metrics = ctx.measureText(line || ' '); // Handle empty lines
    maxWidth = Math.max(maxWidth, metrics.width);
  });

  // Add padding for better visual appearance
  const padding = 8; // 4px on each side

  return {
    width: Math.ceil(maxWidth) + padding,
    height: Math.ceil(lines.length * lineHeight) + padding,
  };
};

/**
 * Measure text dimensions with minimum size constraints
 * @param {string} text - The text to measure
 * @param {number} fontSize - Font size in pixels
 * @param {string} fontFamily - Font family name
 * @param {string} fontWeight - Font weight
 * @param {string} fontStyle - Font style
 * @param {number} minWidth - Minimum width
 * @param {number} minHeight - Minimum height
 * @returns {Object} - {width, height} dimensions
 */
export const measureTextWithMinimums = (
  text,
  fontSize,
  fontFamily,
  fontWeight = 'normal',
  fontStyle = 'normal',
  minWidth = 40,
  minHeight = 30
) => {
  const dimensions = measureTextDimensions(text, fontSize, fontFamily, fontWeight, fontStyle);

  return {
    width: Math.max(dimensions.width, minWidth),
    height: Math.max(dimensions.height, minHeight),
  };
};

/**
 * Get the computed font properties from a DOM element
 * @param {HTMLElement} element - The DOM element
 * @returns {Object} - Font properties object
 */
export const getFontPropertiesFromElement = element => {
  const computedStyle = window.getComputedStyle(element);

  return {
    fontSize: parseInt(computedStyle.fontSize),
    fontFamily: computedStyle.fontFamily,
    fontWeight: computedStyle.fontWeight,
    fontStyle: computedStyle.fontStyle,
  };
};
