import * as htmlToImage from 'html-to-image';

export const exportAsImage = async (format = 'svg', elementId = 'panel-wrapper') => {
  try {
    // Get the specified element
    const panel = document.getElementById(elementId);
    if (!panel) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    // Get the panel's actual dimensions and position
    const rect = panel.getBoundingClientRect();
    
    // Configure export options for exact panel dimensions
    const options = {
      quality: 1.0,
      pixelRatio: format === 'png' ? 3 : 1, // Higher resolution for PNG
      skipFonts: false,
      backgroundColor: null, // Transparent background
      width: 800, // Exact panel width
      height: 400, // Exact panel height
      style: {
        transform: 'scale(1)', // Ensure no scaling
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
      },
      style: {
        // Ensure consistent rendering
        'font-display': 'block',
        'text-rendering': 'geometricPrecision',
        'shape-rendering': 'geometricPrecision'
      }
    };

    // Export based on format
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

    // Create download link
    const link = document.createElement('a');
    link.download = `led-panel.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return dataUrl;
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};
