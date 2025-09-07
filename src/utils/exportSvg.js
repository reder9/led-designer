export const exportSVG = ({ elements, roundedEdges, glowColor, iconSymbols }) => {
  // Font options for mapping font names to classes
  const fontOptions = [
    { name: 'Orbitron', style: 'font-orbitron', category: 'Gaming' },
    { name: 'Russo One', style: 'font-russo-one', category: 'Gaming' },
    { name: 'Play', style: 'font-play', category: 'Gaming' },
    { name: 'Rajdhani', style: 'font-rajdhani', category: 'Gaming' },
    { name: 'Chakra Petch', style: 'font-chakra', category: 'Gaming' },
    { name: 'Audiowide', style: 'font-audiowide', category: 'Gaming' },
    { name: 'Teko', style: 'font-teko', category: 'Gaming' },
    { name: 'Aldrich', style: 'font-aldrich', category: 'Gaming' },
    { name: 'Quantico', style: 'font-quantico', category: 'Gaming' },
    { name: 'Oxanium', style: 'font-oxanium', category: 'Gaming' },
    { name: 'Press Start 2P', style: 'font-press-start', category: 'Retro' },
    { name: 'VT323', style: 'font-vt323', category: 'Retro' },
    { name: 'Share Tech Mono', style: 'font-share-tech', category: 'Retro' },
    { name: 'Iceland', style: 'font-iceland', category: 'Tech' },
    { name: 'Syncopate', style: 'font-syncopate', category: 'Tech' },
    { name: 'Wallpoet', style: 'font-wallpoet', category: 'Tech' },
    { name: 'Nova Square', style: 'font-nova-square', category: 'Tech' },
    { name: 'Michroma', style: 'font-michroma', category: 'Tech' },
    { name: 'Stalinist One', style: 'font-stalinist', category: 'Decorative' },
    { name: 'Rubik Mono One', style: 'font-rubik-mono', category: 'Decorative' },
    { name: 'Faster One', style: 'font-faster-one', category: 'Decorative' },
    { name: 'Monoton', style: 'font-monoton', category: 'Decorative' },
    { name: 'Arial', style: '', category: 'System' },
    { name: 'Impact', style: '', category: 'System' },
  ];

  // Ensure 2:1 ratio dimensions (width is twice the height)
  const panelWidth = 800;
  const panelHeight = 400;

  // Create SVG with proper dimensions and viewBox
  const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet href="https://fonts.googleapis.com/css2?family=Russo+One&family=Orbitron:wght@400;500;600;700;800;900&family=Play:wght@400;700&family=Rajdhani:wght@300;400;500;600;700&family=Chakra+Petch:wght@300;400;500;600;700&family=Audiowide&family=Teko:wght@300;400;500;600;700&family=Aldrich&family=Quantico:wght@400;700&family=Oxanium:wght@200;300;400;500;600;700;800&family=Iceland&family=Syncopate:wght@400;700&family=Wallpoet&family=Press+Start+2P&family=VT323&family=Share+Tech+Mono&family=Nova+Square&family=Michroma&family=Stalinist+One&family=Rubik+Mono+One&family=Faster+One&family=Monoton&display=swap" type="text/css"?>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="${panelWidth}" 
      height="${panelHeight}" 
      viewBox="0 0 ${panelWidth} ${panelHeight}"
      preserveAspectRatio="xMidYMid meet"
      style="overflow: visible;"
    >
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Orbitron:wght@400;500;600;700;800;900&family=Play:wght@400;700&family=Rajdhani:wght@300;400;500;600;700&family=Chakra+Petch:wght@300;400;500;600;700&family=Audiowide&family=Teko:wght@300;400;500;600;700&family=Aldrich&family=Quantico:wght@400;700&family=Oxanium:wght@200;300;400;500;600;700;800&family=Iceland&family=Syncopate:wght@400;700&family=Wallpoet&family=Press+Start+2P&family=VT323&family=Share+Tech+Mono&family=Nova+Square&family=Michroma&family=Stalinist+One&family=Rubik+Mono+One&family=Faster+One&family=Monoton&display=swap');
      
      /* Gaming and streaming-specific font classes */
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
    </style>`;
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
    if (el.type === 'icon' && el.content && !iconContentMap[el.content]) {
      const symbolMatch = iconSymbols.match(
        new RegExp(`<symbol id="icon-${el.content}"[^>]*>(.*?)</symbol>`, 's')
      );
      if (symbolMatch) {
        iconContentMap[el.content] = symbolMatch[1].trim();
      }
    }
  });

  const svgContent = elements
    .map(el => {
      if (el.type === 'text') {
        const fontWeight = el.fontWeight || 'normal';
        const fontStyle = el.fontStyle || 'normal';
        const textAnchor =
          el.textAlign === 'left' ? 'start' : el.textAlign === 'right' ? 'end' : 'middle';

        // Create a container group for the text with exact positioning
        const fontClass = fontOptions.find(f => f.name === el.fontFamily)?.style || '';
        return `
        <g transform="translate(${el.x},${el.y})">
          <text
            x="${el.textAlign === 'left' ? 0 : el.textAlign === 'right' ? el.width : el.width / 2}"
            y="${el.height / 2}"
            class="${fontClass}"
            font-size="${el.fontSize}px"
            font-weight="${fontWeight}"
            font-style="${fontStyle}"
            text-anchor="${textAnchor}"
            dominant-baseline="middle"
            fill="${glowColor}"
            style="filter: url(#glow)"
          >${el.content}</text>
        </g>`;
      } else if (el.type === 'icon' && el.content && iconContentMap[el.content]) {
        // Directly embed the icon SVG content with proper scaling
        const scale = Math.min(el.width / 24, el.height / 24); // Assuming original viewBox is 24x24
        return `
        <g transform="translate(${el.x},${el.y})">
          <g transform="scale(${scale})" fill="${glowColor}" style="filter: url(#iconGlow)">
            ${iconContentMap[el.content]}
          </g>
        </g>`;
      }
      return '';
    })
    .join('\n');

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

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'panel-export.svg';
  a.click();
  URL.revokeObjectURL(url);
};
