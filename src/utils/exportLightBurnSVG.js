import { iconComponentMap } from './iconMap';

export const exportLightBurnSVG = ({ elements, roundedEdges, glowColor, width = 800, height = 400 }) => {
  // Create a clean SVG specifically for LightBurn compatibility
  const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs>
  <style><![CDATA[
    @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Orbitron:wght@400;500;600;700;800;900&family=Play:wght&400;700&family=Rajdhani:wght&300;400;500;600;700&family=Chakra+Petch:wght&300;400;500;600;700&family=Audiowide&family=Teko:wght&300;400;500;600;700&family=Aldrich&family=Quantico:wght&400;700&family=Oxanium:wght&200;300;400;500;600;700;800&family=Iceland&family=Syncopate:wght&400;700&family=Wallpoet&family=Press+Start+2P&family=VT323&family=Share+Tech+Mono&family=Nova+Square&family=Michroma&family=Stalinist+One&family=Rubik+Mono+One&family=Faster+One&family=Monoton&display=swap');
    
    .font-orbitron { font-family: 'Orbitron', sans-serif; }
    .font-play { font-family: 'Play', sans-serif; }
    .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
    .font-chakra { font-family: 'Chakra Petch', sans-serif; }
    .font-audiowide { font-family: 'Audiowide', cursive; }
    .font-teko { font-family: 'Teko', sans-serif; }
    .font-aldrich { font-family: 'Aldrich', sans-serif; }
    .font-quantico { font-family: 'Quantico', sans-serif; }
    .font-oxanium { font-family: 'Oxanium', cursive; }
    .font-iceland { font-family: 'Iceland', cursive; }
    .font-syncopate { font-family: 'Syncopate', sans-serif; }
    .font-wallpoet { font-family: 'Wallpoet', cursive; }
    .font-press-start { font-family: 'Press Start 2P', monospace; }
    .font-vt323 { font-family: 'VT323', monospace; }
    .font-share-tech { font-family: 'Share Tech Mono', monospace; }
    .font-nova-square { font-family: 'Nova Square', cursive; }
    .font-michroma { font-family: 'Michroma', sans-serif; }
    .font-stalinist { font-family: 'Stalinist One', cursive; }
    .font-rubik-mono { font-family: 'Rubik Mono One', sans-serif; }
    .font-faster-one { font-family: 'Faster One', cursive; }
    .font-monoton { font-family: 'Monoton', cursive; }
    .font-russo-one { font-family: 'Russo One', sans-serif; }
  ]]></style>
</defs>`;
  
  const svgFooter = `</svg>`;

  // Background rectangle (exact match)
  const background = `
  <rect x="0" y="0" width="${width}" height="${height}" fill="black" stroke="none" rx="${roundedEdges ? 20 : 0}"/>`;

  // Helper function to get font class from font name
  const getFontClass = (fontFamily) => {
    const fontMap = {
      "Orbitron": "font-orbitron",
      "Russo One": "font-russo-one", 
      "Play": "font-play",
      "Rajdhani": "font-rajdhani",
      "Chakra Petch": "font-chakra",
      "Audiowide": "font-audiowide",
      "Teko": "font-teko",
      "Aldrich": "font-aldrich",
      "Quantico": "font-quantico",
      "Oxanium": "font-oxanium",
      "Press Start 2P": "font-press-start",
      "VT323": "font-vt323",
      "Share Tech Mono": "font-share-tech",
      "Iceland": "font-iceland",
      "Syncopate": "font-syncopate",
      "Wallpoet": "font-wallpoet",
      "Nova Square": "font-nova-square",
      "Michroma": "font-michroma",
      "Stalinist One": "font-stalinist",
      "Rubik Mono One": "font-rubik-mono",
      "Faster One": "font-faster-one",
      "Monoton": "font-monoton"
    };
    return fontMap[fontFamily] || '';
  };

  // Helper function to get actual icon SVG content
  const getIconSVG = async (iconKey) => {
    try {
      const IconComponent = iconComponentMap[iconKey];
      if (!IconComponent) return null;

      // Create a temporary div to render the icon and extract SVG
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.innerHTML = `<div id="temp-icon"></div>`;
      document.body.appendChild(tempDiv);

      // This is a simplified approach - in reality, you'd need to extract the actual SVG paths
      // For now, we'll use placeholder paths for common icons
      const iconPaths = {
        'twitch': 'M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6.857 0L1.714 5.143v11.429h4.572V20l5.143-3.428h4.285L21.143 11.143V0zM19.429 10.286l-3.428 3.428h-3.429l-3 3v-3H5.714V1.714h13.715z',
        'youtube': 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
        'discord': 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.196.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z'
      };

      document.body.removeChild(tempDiv);
      return iconPaths[iconKey] || null;
    } catch (error) {
      console.error('Error getting icon SVG:', error);
      return null;
    }
  };

  // Convert elements to exact SVG representation
  const svgContent = elements.map(el => {
    if (el.type === "text") {
      // Exact text positioning to match preview
      const textAnchor = el.textAlign === "left" ? "start" : 
                        el.textAlign === "right" ? "end" : "middle";
      
      const x = el.textAlign === "left" ? el.x : 
               el.textAlign === "right" ? el.x + el.width : 
               el.x + (el.width / 2);
      
      // Adjust y position to match exactly - text baseline in SVG is different
      const y = el.y + (el.height / 2) + (el.fontSize * 0.35);
      
      const fontClass = getFontClass(el.fontFamily);
      const fontFamilyAttr = fontClass ? '' : `font-family="${el.fontFamily}"`;
      const classAttr = fontClass ? `class="${fontClass}"` : '';
      
      return `
  <text x="${x}" y="${y}" ${fontFamilyAttr} ${classAttr} font-size="${el.fontSize}" 
        font-weight="${el.fontWeight || 'normal'}" font-style="${el.fontStyle || 'normal'}" 
        text-anchor="${textAnchor}" 
        fill="${glowColor}" stroke="none">${el.content}</text>`;
        
    } else if (el.type === "icon") {
      // Get the actual icon path and scale it properly
      const iconPaths = {
        'twitch': 'M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6.857 0L1.714 5.143v11.429h4.572V20l5.143-3.428h4.285L21.143 11.143V0zM19.429 10.286l-3.428 3.428h-3.429l-3 3v-3H5.714V1.714h13.715z',
        'youtube': 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
        'discord': 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.196.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.030z'
      };

      const iconPath = iconPaths[el.iconKey] || iconPaths[el.content];
      
      if (iconPath) {
        // Calculate scale to fit the element size (assuming original viewBox is 24x24)
        const scale = Math.min(el.width / 24, el.height / 24);
        const translateX = el.x + (el.width - 24 * scale) / 2;
        const translateY = el.y + (el.height - 24 * scale) / 2;
        
        return `
  <g transform="translate(${translateX},${translateY}) scale(${scale})">
    <path d="${iconPath}" fill="${glowColor}" stroke="none"/>
  </g>`;
      } else {
        // Fallback: simple rectangle with icon name
        return `
  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" 
        fill="none" stroke="${glowColor}" stroke-width="2" rx="4"/>
  <text x="${el.x + el.width/2}" y="${el.y + el.height/2}" font-family="Arial" font-size="10" 
        text-anchor="middle" dominant-baseline="middle" fill="${glowColor}" 
        stroke="none">${el.iconKey || 'ICON'}</text>`;
      }
    }
    return "";
  }).join("\n");

  const svgString = svgHeader + background + svgContent + svgFooter;

  // Create and download the file
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'led-panel-lightburn.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return svgString;
};
