// Function to convert a pixel value to mm (assuming 96 DPI)
const pxToMm = px => (px * 25.4) / 96;

const generateSvgPath = (element, _width, _height) => {
  if (element.type === 'text') {
    // For text elements, create a text element with specific attributes LightBurn expects
    return `
      <text
        x="${pxToMm(element.x + element.width / 2)}"
        y="${pxToMm(element.y + element.height / 2)}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="${element.fontFamily}"
        font-size="${pxToMm(element.fontSize)}mm"
        fill="none"
        stroke="black"
        stroke-width="0.1"
      >${element.content}</text>`;
  } else if (element.type === 'icon') {
    // For icons, we'll create a simple rectangular placeholder
    // This ensures the position is preserved in LightBurn
    return `
      <rect
        x="${pxToMm(element.x)}"
        y="${pxToMm(element.y)}"
        width="${pxToMm(element.width)}"
        height="${pxToMm(element.height)}"
        fill="none"
        stroke="black"
        stroke-width="0.1"
      />`;
  }
  return '';
};

export const exportForLightBurn = ({ elements, width, height }) => {
  // Convert dimensions to mm
  const widthMm = pxToMm(width);
  const heightMm = pxToMm(height);

  // Create SVG header with mm units and LightBurn-friendly viewBox
  const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns="http://www.w3.org/2000/svg"
   width="${widthMm}mm"
   height="${heightMm}mm"
   viewBox="0 0 ${widthMm} ${heightMm}"
   version="1.1">
  <g
     transform="scale(1,-1) translate(0,-${heightMm})"
     stroke="black"
     fill="none"
     stroke-width="0.1">
    ${elements.map(el => generateSvgPath(el, width, height)).join('')}
  </g>
</svg>`;

  // Create and trigger download
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'lightburn-panel.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
