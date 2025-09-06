import * as htmlToImage from 'html-to-image';

export const exportAsImage = async (format = 'png', elementId = 'panel-wrapper', onProgress = null) => {
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

    updateProgress(20, 'Analyzing design elements...');

    // Step 1: Save current states and ensure text visibility without changing colors
    const textElements = panel.querySelectorAll('textarea, span, p, h1, h2, h3, h4, h5, h6, div[contenteditable], [data-text-element="true"]');
    const savedStates = [];
    
    textElements.forEach((element, index) => {
      savedStates[index] = {
        element: element,
        originalOpacity: element.style.opacity,
        originalVisibility: element.style.visibility,
        originalBorder: element.style.border,
        originalOutline: element.style.outline,
        originalDisplay: element.style.display
      };
    });

    updateProgress(35, 'Ensuring text visibility...');

    // Step 2: Only modify visibility/opacity properties, preserve all colors and styling
    textElements.forEach(element => {
      // Ensure text is visible without changing colors
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      element.style.display = element.style.display || 'block';
      // Remove selection borders for clean export
      element.style.border = 'none';
      element.style.outline = 'none';
      // Enhance text rendering quality
      element.style.textRendering = 'geometricPrecision';
      element.style.webkitFontSmoothing = 'antialiased';
      element.style.mozOsxFontSmoothing = 'grayscale';
    });

    updateProgress(50, 'Optimizing for export...');

    // Step 3: Wait for styles to apply and DOM to stabilize
    await new Promise(resolve => setTimeout(resolve, 200));

    updateProgress(65, 'Capturing high-quality image...');

    // Configure export options
    const options = {
      quality: 1.0,
      pixelRatio: format === 'png' ? 3 : 1,
      skipFonts: false,
      backgroundColor: null,
      width: 800,
      height: 400,
      useCORS: true,
      allowTaint: true,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
        width: '800px',
        height: '400px'
      },
      filter: (node) => {
        // Exclude UI elements that shouldn't be in export
        const excludeClasses = [
          'resize-handle',
          'react-resizable-handle',
          'selection-border',
          'distance-indicator',
          'snapping-guide'
        ];
        
        if (node.classList) {
          for (const className of excludeClasses) {
            if (node.classList.contains(className)) {
              return false;
            }
          }
        }
        
        // Exclude dashed borders (selection indicators)
        if (node.style && node.style.border && node.style.border.includes('dashed')) {
          return false;
        }
        
        return true;
      }
    };

    updateProgress(75, 'Generating image data...');

    // Step 4: Perform the export
    let dataUrl;
    switch (format.toLowerCase()) {
      case 'svg':
        dataUrl = await htmlToImage.toSvg(panel, options);
        break;
      case 'png':
        dataUrl = await htmlToImage.toPng(panel, options);
        break;
      case 'jpeg':
      case 'jpg':
        dataUrl = await htmlToImage.toJpeg(panel, options);
        break;
      default:
        throw new Error('Unsupported format');
    }

    updateProgress(85, 'Restoring original styling...');

    // Step 5: Restore only the properties we modified (not colors)
    savedStates.forEach(state => {
      const element = state.element;
      element.style.opacity = state.originalOpacity || '';
      element.style.visibility = state.originalVisibility || '';
      element.style.border = state.originalBorder || '';
      element.style.outline = state.originalOutline || '';
      element.style.display = state.originalDisplay || '';
    });

    updateProgress(95, 'Preparing download...');

    // Step 6: Create download link
    const link = document.createElement('a');
    link.download = `led-panel.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    updateProgress(100, 'Export complete!');

    // Small delay to show completion
    await new Promise(resolve => setTimeout(resolve, 500));

    return dataUrl;
  } catch (error) {
    console.error('Export failed:', error);
    
    // Ensure we restore states even if export fails
    const panel = document.getElementById(elementId);
    if (panel) {
      const textElements = panel.querySelectorAll('textarea, span, p, h1, h2, h3, h4, h5, h6, div[contenteditable], [data-text-element="true"]');
      textElements.forEach(element => {
        // Reset only the properties we modify, leave colors intact
        element.style.removeProperty('opacity');
        element.style.removeProperty('visibility');
        element.style.removeProperty('border');
        element.style.removeProperty('outline');
        element.style.removeProperty('display');
      });
    }
    
    throw error;
  }
};
