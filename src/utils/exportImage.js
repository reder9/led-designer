import * as htmlToImage from 'html-to-image';

export const exportImage = async (elementId, format = 'png', onProgress = () => {}) => {
  let svgElements = [];
  let originalStyles = [];
  let textElements = [];
  let originalTextStyles = [];

  try {
    // Ensure format is a string
    if (typeof format !== 'string') {
      format = 'png';
    }

    // Progress callback helper
    const updateProgress = (progress, message) => {
      if (onProgress) onProgress(progress, message);
    };

    updateProgress(10, 'Initializing export...');

    // Get the specified element
    const panel = document.getElementById(elementId);
    if (!panel) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    updateProgress(30, 'Preparing export...');

    // Create a simple CSS override that makes everything cyan
    const style = document.createElement('style');
    style.id = 'export-override-styles';
    style.textContent = `
      /* Hide guides and selection handles */
      #${elementId} .bg-cyan-400,
      #${elementId} .bg-cyan-300,
      #${elementId} [class*="moveable"],
      #${elementId} .moveable-control-box,
      #${elementId} .moveable-line,
      #${elementId} [data-able="moveable"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      
      /* Make everything cyan and remove all effects - enhanced for complex SVGs */
      #${elementId} *,
      #${elementId} textarea,
      #${elementId} [contenteditable],
      #${elementId} svg,
      #${elementId} svg *,
      #${elementId} path,
      #${elementId} circle,
      #${elementId} rect,
      #${elementId} polygon,
      #${elementId} g,
      #${elementId} line,
      #${elementId} ellipse,
      #${elementId} [style*="fill"],
      #${elementId} svg [style*="fill"],
      #${elementId} path[style*="fill"] {
        fill: #00ffff !important;
        stroke: none !important;
        stroke-width: 0 !important;
        color: #00ffff !important;
        text-shadow: none !important;
        box-shadow: none !important;
        filter: none !important;
        background: transparent !important;
        border: none !important;
        outline: none !important;
        animation: none !important;
        transform: none !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      /* Specific rules to remove text glow/border effects - AGGRESSIVE VERSION */
      #${elementId} textarea,
      #${elementId} [contenteditable],
      #${elementId} .text-element,
      #${elementId} div[style*="text-shadow"],
      #${elementId} textarea[style*="text-shadow"],
      #${elementId} [data-text-element="true"],
      #${elementId} [data-element-type="text"],
      #${elementId} textarea[data-element-type="text"],
      #${elementId} div[style*="filter"],
      #${elementId} span,
      #${elementId} p {
        text-shadow: none !important;
        filter: none !important;
        box-shadow: none !important;
        border: none !important;
        outline: none !important;
        -webkit-text-stroke: 0 !important;
        -webkit-text-stroke-width: 0 !important;
        -webkit-text-stroke-color: transparent !important;
        text-stroke: 0 !important;
        text-outline: none !important;
        animation: none !important;
        transition: none !important;
        color: #00ffff !important;
      }
      
      /* Extra aggressive targeting for any possible glow scenarios */
      #${elementId} *[style*="text-shadow"] {
        text-shadow: none !important;
      }
      
      #${elementId} *[style*="0 0"] {
        text-shadow: none !important;
      }
      
      /* Ensure panel background is transparent */
      #${elementId} {
        background: transparent !important;
        box-shadow: none !important;
        filter: none !important;
      }
    `;
    document.head.appendChild(style);

    // Programmatically override inline styles on SVG elements for complex SVGs
    svgElements = panel.querySelectorAll(
      'svg *[style*="fill"], svg path, svg circle, svg rect, svg polygon, svg g, svg line, svg ellipse'
    );
    originalStyles = [];

    svgElements.forEach((element, index) => {
      // Store original style for cleanup
      originalStyles[index] = element.style.cssText;
      // Force cyan fill and remove other styling
      element.style.fill = '#00ffff';
      element.style.stroke = 'none';
      element.style.strokeWidth = '0';
      element.style.filter = 'none';
      element.style.opacity = '1';
    });

    // Programmatically and aggressively override ALL text elements to remove glow effects
    textElements = panel.querySelectorAll(
      'textarea, [contenteditable], [data-text-element="true"], [data-element-type="text"]'
    );
    originalTextStyles = [];

    textElements.forEach((element, index) => {
      // Store original style for cleanup
      originalTextStyles[index] = {
        cssText: element.style.cssText,
        className: element.className,
      };

      // Preserve important font properties before clearing
      const fontSize = element.style.fontSize || getComputedStyle(element).fontSize;
      const fontFamily = element.style.fontFamily || getComputedStyle(element).fontFamily;
      const fontWeight = element.style.fontWeight || getComputedStyle(element).fontWeight;
      const textAlign = element.style.textAlign || getComputedStyle(element).textAlign;

      // COMPLETELY remove all glow effects by brute force
      element.style.cssText = ''; // Clear all inline styles first

      // Set only the essential styles we need, nothing else
      element.style.setProperty('color', '#00ffff', 'important');
      element.style.setProperty('text-shadow', 'none', 'important');
      element.style.setProperty('filter', 'none', 'important');
      element.style.setProperty('box-shadow', 'none', 'important');
      element.style.setProperty('border', 'none', 'important');
      element.style.setProperty('outline', 'none', 'important');
      element.style.setProperty('background', 'transparent', 'important');
      element.style.setProperty('-webkit-text-stroke', '0', 'important');
      element.style.setProperty('animation', 'none', 'important');
      element.style.setProperty('transition', 'none', 'important');

      // Preserve essential layout and font properties
      element.style.setProperty('width', '100%', 'important');
      element.style.setProperty('height', '100%', 'important');
      element.style.setProperty('resize', 'none', 'important');
      element.style.setProperty('font-size', fontSize, 'important');
      element.style.setProperty('font-family', fontFamily, 'important');
      element.style.setProperty('font-weight', fontWeight, 'important');
      element.style.setProperty('text-align', textAlign, 'important');
    });

    updateProgress(50, 'Capturing image...');

    // Generate the image
    let dataUrl;
    const exportOptions = {
      backgroundColor: 'transparent',
      skipFonts: true, // Skip external font loading to avoid CORS issues
      skipDefaultFonts: false, // Allow system fonts
      filter: node => {
        // Skip external stylesheets that cause CORS issues
        if (node.tagName === 'LINK' && node.href && node.href.includes('fonts.googleapis.com')) {
          return false;
        }
        return true;
      },
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    };

    if (format === 'svg') {
      dataUrl = await htmlToImage.toSvg(panel, exportOptions);
    } else {
      dataUrl = await htmlToImage.toPng(panel, {
        ...exportOptions,
        pixelRatio: 2, // Higher quality for PNG
      });
    }

    // Remove the style override and restore original SVG styles
    document.head.removeChild(style);

    // Restore original inline styles on SVG elements
    svgElements.forEach((element, index) => {
      if (originalStyles[index]) {
        element.style.cssText = originalStyles[index];
      }
    });

    // Restore original inline styles on text elements
    textElements.forEach((element, index) => {
      if (originalTextStyles[index]) {
        element.style.cssText = originalTextStyles[index].cssText;
        element.className = originalTextStyles[index].className;
      }
    });

    updateProgress(90, 'Preparing download...');

    // Create download link
    const link = document.createElement('a');
    link.download = `led-panel.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    updateProgress(100, 'Export complete!');

    return dataUrl;
  } catch (error) {
    // Clean up style if it exists
    const existingStyle = document.getElementById('export-override-styles');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }

    // Restore original SVG styles in case of error
    if (svgElements.length > 0 && originalStyles.length > 0) {
      svgElements.forEach((element, index) => {
        if (originalStyles[index]) {
          element.style.cssText = originalStyles[index];
        }
      });
    }

    // Restore original text styles in case of error
    if (textElements.length > 0 && originalTextStyles.length > 0) {
      textElements.forEach((element, index) => {
        if (originalTextStyles[index]) {
          element.style.cssText = originalTextStyles[index].cssText;
          element.className = originalTextStyles[index].className;
        }
      });
    }

    console.error('Export failed:', error);
    throw error;
  }
};
