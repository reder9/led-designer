export const exportSVG = ({ elements, roundedEdges, glowColor, iconSymbols }) => {
  // Ensure 2:1 ratio dimensions (width is twice the height)
  const panelWidth = 800;
  const panelHeight = 400;

  // Create SVG with proper dimensions and viewBox
  const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="${panelWidth}" 
      height="${panelHeight}" 
      viewBox="0 0 ${panelWidth} ${panelHeight}"
      preserveAspectRatio="xMidYMid meet"
      style="overflow: visible;"
    >`;
  const svgFooter = `</svg>`;

  // Background rectangle with proper dimensions and rounded corners
  const rect = `
    <rect
      x="0"
      y="0"
      width="${panelWidth}"
      height="${panelHeight}"
      fill="black"
      rx="${roundedEdges ? 20 : 0}"
      ry="${roundedEdges ? 20 : 0}"
    />`;

  // Create a map of icon content for direct embedding
  const iconContentMap = {};

  // Extract SVG content for each icon that's being used
  elements.forEach(el => {
    if (el.type === "icon" && el.content && !iconContentMap[el.content]) {
      const symbolMatch = iconSymbols.match(new RegExp(`<symbol id="icon-${el.content}"[^>]*>(.*?)</symbol>`, 's'));
      if (symbolMatch) {
        iconContentMap[el.content] = symbolMatch[1].trim();
      }
    }
  });

  const svgContent = elements.map(el => {
    if (el.type === "text") {
      const fontWeight = el.fontWeight || "normal";
      const fontStyle = el.fontStyle || "normal";
      const textAnchor = el.textAlign === "left" ? "start" : 
                        el.textAlign === "right" ? "end" : "middle";
      
      // Create a container group for the text with exact positioning
      return `
        <g transform="translate(${el.x},${el.y})">
          <text
            x="${el.textAlign === "left" ? 0 : 
               el.textAlign === "right" ? el.width : 
               el.width / 2}"
            y="${el.height / 2}"
            font-family="${el.fontFamily}"
            font-size="${el.fontSize}"
            font-weight="${fontWeight}"
            font-style="${fontStyle}"
            text-anchor="${textAnchor}"
            dominant-baseline="middle"
            fill="${glowColor}"
            style="filter: url(#glow)"
          >${el.content}</text>
        </g>`;
    } else if (el.type === "icon" && el.content && iconContentMap[el.content]) {
      // Directly embed the icon SVG content with proper scaling
      const scale = Math.min(el.width / 24, el.height / 24); // Assuming original viewBox is 24x24
      return `
        <g transform="translate(${el.x},${el.y})">
          <g transform="scale(${scale})" fill="${glowColor}" style="filter: url(#iconGlow)">
            ${iconContentMap[el.content]}
          </g>
        </g>`;
    }
    return "";
  }).join("\n");

  // Glow filters
  const filters = `
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feFlood flood-color="${glowColor}" flood-opacity="0.8" result="colorAlpha"/>
        <feComposite in="colorAlpha" in2="coloredBlur" operator="in" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="iconGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feFlood flood-color="${glowColor}" flood-opacity="1"/>
        <feComposite in2="blur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `;

  // Combine all SVG parts
  const svgString = `${svgHeader}${filters}${rect}${svgContent}${svgFooter}`;

  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "panel-export.svg";
  a.click();
  URL.revokeObjectURL(url);
};
