import * as htmlToImage from 'html-to-image';

export const exportAsImage = async (
  format = 'png',
  elementId = 'panel-wrapper',
  onProgress = null
) => {
  // Declare saved styles variables in function scope for error handling
  let savedPanelStyles = {};
  let savedElementStyles = [];
  let savedTextStyles = [];
  let savedIconStyles = [];
  let savedFilterStyles = [];

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

    updateProgress(20, 'Preparing solid cyan export mode...');

    // Step 1: Save all current styling states for restoration
    savedPanelStyles = {};
    savedElementStyles = [];
    savedTextStyles = [];
    savedIconStyles = [];
    savedFilterStyles = [];

    // Save panel wrapper styles
    const panelWrapper = panel;
    savedPanelStyles.panelWrapper = {
      element: panelWrapper,
      filter: panelWrapper.style.filter,
      background: panelWrapper.style.background,
      boxShadow: panelWrapper.style.boxShadow,
    };

    // Save LED border glow styles
    const ledBorderElements = panel.querySelectorAll(
      '[class*="glow"], [style*="filter"], [style*="boxShadow"]'
    );
    ledBorderElements.forEach((element, index) => {
      savedElementStyles[index] = {
        element,
        filter: element.style.filter,
        background: element.style.background,
        boxShadow: element.style.boxShadow,
        opacity: element.style.opacity,
      };
    });

    // Save text element styles (target actual textarea elements)
    const textElements = panel.querySelectorAll(
      'textarea, [contenteditable="true"], [data-text-element], .element-wrapper textarea'
    );
    textElements.forEach((element, index) => {
      savedTextStyles[index] = {
        element,
        originalOpacity: element.style.opacity,
        originalVisibility: element.style.visibility,
        originalBorder: element.style.border,
        originalOutline: element.style.outline,
        originalDisplay: element.style.display,
        originalFilter: element.style.filter,
        originalColor: element.style.color,
        originalTextShadow: element.style.textShadow,
        originalAnimation: element.style.animation,
        originalBackground: element.style.background,
        originalBackgroundColor: element.style.backgroundColor,
      };
    });

    // Save icon element styles - target React component containers and inline SVG elements
    const iconElements = panel.querySelectorAll(
      '[data-element-type="icon"], [data-element-type="icon"] *, [data-element-type="icon"] svg, [data-element-type="icon"] svg *, .element-wrapper svg, .element-wrapper svg *, svg, path, circle, rect, polygon, g, line, ellipse'
    );
    // console.log('All icon-related elements found:', iconElements.length);
    // console.log('Icon elements:', Array.from(iconElements).map(el => ({ tag: el.tagName, class: el.className, dataset: el.dataset })));

    iconElements.forEach((element, index) => {
      savedIconStyles[index] = {
        element,
        originalFilter: element.style.filter,
        originalColor: element.style.color,
        originalFill: element.style.fill || element.getAttribute('fill'),
        originalStroke: element.style.stroke || element.getAttribute('stroke'),
        originalAnimation: element.style.animation,
        originalOpacity: element.style.opacity,
      };
    });

    // Step 2.5: Disable all SVG filter definitions to prevent any glow effects
    const allSVGFilters = panel.querySelectorAll(
      'svg defs, svg filter, feGaussianBlur, feComponentTransfer, feFuncR, feFuncG, feFuncB, feColorMatrix, filter[id*="colored"], filter[id*="invert"]'
    );
    allSVGFilters.forEach((filterElement, index) => {
      savedFilterStyles[index] = {
        element: filterElement,
        originalDisplay: filterElement.style.display,
      };
      filterElement.style.display = 'none'; // Hide all SVG filters during export
    });

    updateProgress(35, 'Applying solid cyan styling...');

    // console.log('=== EXPORT DEBUG INFO ===');
    // console.log('Panel element:', panel);
    // console.log('Text elements found:', textElements.length);
    // console.log('Icon elements found:', iconElements.length);
    // console.log('Element wrappers found:', panel.querySelectorAll('.element-wrapper').length);

    // Debug: Log all element wrappers and their contents
    const elementWrappers = panel.querySelectorAll('.element-wrapper');
    elementWrappers.forEach((_wrapper, _index) => {
      // console.log(`Element wrapper ${index}:`, {
      //   innerHTML: wrapper.innerHTML.substring(0, 200) + '...',
      //   children: Array.from(wrapper.children).map(child => ({
      //     tag: child.tagName,
      //     className: child.className,
      //     dataset: child.dataset,
      //     style: child.style.cssText.substring(0, 100)
      //   }))
      // });
    });

    // Debug: Check if there are any SVG elements at all in the panel
    const allSVGs = panel.querySelectorAll('svg');
    // console.log('All SVG elements found:', allSVGs.length);
    allSVGs.forEach((_svg, _index) => {
      // console.log(`SVG ${index}:`, {
      //   innerHTML: svg.innerHTML.substring(0, 200),
      //   style: svg.style.cssText,
      //   attributes: Array.from(svg.attributes).map(attr => `${attr.name}="${attr.value}"`)
      // });
    });

    // Step 2: Apply solid cyan export styling

    // Remove all glow effects from panel wrapper
    panelWrapper.style.filter = 'none';
    panelWrapper.style.background = 'transparent';
    panelWrapper.style.boxShadow = 'none';

    // Remove all glow/filter effects from LED border and other elements
    ledBorderElements.forEach(element => {
      element.style.filter = 'none';
      element.style.background = 'transparent';
      element.style.boxShadow = 'none';
      element.style.opacity = '0'; // Hide glow elements completely
    });

    // Apply solid cyan styling to all text elements
    textElements.forEach(element => {
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      element.style.display = element.style.display || 'block';
      element.style.border = 'none';
      element.style.outline = 'none';
      element.style.filter = 'none'; // Remove all glow effects
      element.style.color = '#00ffff !important'; // Solid cyan color with importance
      element.style.textShadow = 'none'; // Remove text shadow
      element.style.animation = 'none'; // Stop any animations
      element.style.background = 'transparent';
      element.style.backgroundColor = 'transparent';
      // Force color with CSS custom property as well
      element.style.setProperty('color', '#00ffff', 'important');
      // Enhance text rendering quality
      element.style.textRendering = 'geometricPrecision';
      element.style.webkitFontSmoothing = 'antialiased';
      element.style.mozOsxFontSmoothing = 'grayscale';
    });

    // Apply solid cyan styling to all icon elements - be more aggressive
    iconElements.forEach(element => {
      element.style.filter = 'none !important'; // Remove all glow effects
      element.style.animation = 'none'; // Stop any animations
      element.style.opacity = '1'; // Ensure visibility

      // Set cyan color for all icon-related elements with force
      element.style.setProperty('color', '#00ffff', 'important');
      element.style.setProperty('fill', '#00ffff', 'important');
      element.style.setProperty('stroke', '#00ffff', 'important');

      // Remove any complex filters or transformations
      element.style.setProperty('filter', 'none', 'important');
      element.style.setProperty('transform', 'none', 'important');
      element.style.setProperty('box-shadow', 'none', 'important');
      element.style.setProperty('text-shadow', 'none', 'important');

      // Also set attributes for SVG elements (some use attributes instead of styles)
      if (element.setAttribute) {
        element.setAttribute('fill', '#00ffff');
        if (element.getAttribute('stroke') !== null) {
          element.setAttribute('stroke', '#00ffff');
        }
        // Also set data attributes for more aggressive styling
        element.setAttribute('data-export-color', '#00ffff');
      }

      // For SVG paths and elements, also try CSS variables
      if (element.tagName && element.tagName.toLowerCase() === 'svg') {
        element.style.setProperty('--icon-color', '#00ffff');
      }
    });

    // Additional pass to find and style any missed elements - specifically target icon containers
    const allElementWrappers = panel.querySelectorAll('.element-wrapper');
    allElementWrappers.forEach(wrapper => {
      const iconContainer = wrapper.querySelector('[data-element-type="icon"]');
      if (iconContainer) {
        // Remove all filters and effects from the icon container and its children
        iconContainer.style.setProperty('filter', 'none', 'important');
        iconContainer.style.setProperty('box-shadow', 'none', 'important');
        iconContainer.style.setProperty('border', 'none', 'important');
        iconContainer.style.setProperty('opacity', '1', 'important');
        iconContainer.style.setProperty('visibility', 'visible', 'important');

        // Force all child elements to cyan with no effects - be more specific about targeting
        const allChildren = iconContainer.querySelectorAll('*');
        allChildren.forEach(child => {
          if (child.style) {
            child.style.setProperty('color', '#00ffff', 'important');
            child.style.setProperty('fill', '#00ffff', 'important');
            child.style.setProperty('stroke', '#00ffff', 'important');
            child.style.setProperty('filter', 'none', 'important');
            child.style.setProperty('box-shadow', 'none', 'important');
            child.style.setProperty('text-shadow', 'none', 'important');
            child.style.setProperty('transform', 'none', 'important');
            child.style.setProperty('opacity', '1', 'important');
            child.style.setProperty('visibility', 'visible', 'important');
            child.style.setProperty('display', 'block', 'important');

            // Ensure proper sizing for SVG elements
            if (child.tagName && child.tagName.toLowerCase() === 'svg') {
              child.style.setProperty('width', '100%', 'important');
              child.style.setProperty('height', '100%', 'important');
              child.style.setProperty('max-width', 'none', 'important');
              child.style.setProperty('max-height', 'none', 'important');
              child.style.setProperty('overflow', 'visible', 'important');
            }
          }

          // Set SVG attributes more aggressively
          if (
            child.setAttribute &&
            (child.tagName === 'svg' ||
              child.tagName === 'SVG' ||
              child.tagName === 'path' ||
              child.tagName === 'PATH' ||
              child.tagName === 'circle' ||
              child.tagName === 'CIRCLE' ||
              child.tagName === 'rect' ||
              child.tagName === 'RECT' ||
              child.tagName === 'g' ||
              child.tagName === 'G' ||
              child.tagName === 'polygon' ||
              child.tagName === 'POLYGON' ||
              child.tagName === 'line' ||
              child.tagName === 'LINE' ||
              child.tagName === 'ellipse' ||
              child.tagName === 'ELLIPSE')
          ) {
            child.setAttribute('fill', '#00ffff');
            if (child.hasAttribute('stroke')) {
              child.setAttribute('stroke', '#00ffff');
            }

            // For SVG elements, ensure proper viewBox and sizing
            if (child.tagName === 'svg' || child.tagName === 'SVG') {
              child.setAttribute('width', '100%');
              child.setAttribute('height', '100%');
              child.setAttribute('preserveAspectRatio', 'xMidYMid meet');
              if (!child.hasAttribute('viewBox')) {
                child.setAttribute('viewBox', '0 0 24 24');
              }
            }
          }
        });

        // Also find and disable any SVG filter definitions within this icon
        const filterDefs = iconContainer.querySelectorAll(
          'defs, filter, feColorMatrix, feComponentTransfer, feFuncR, feFuncG, feFuncB'
        );
        filterDefs.forEach(filterEl => {
          if (filterEl.style) {
            filterEl.style.setProperty('display', 'none', 'important');
          }
        });
      }
    });

    updateProgress(50, 'Optimizing for export...');

    // Step 3: Add CSS rule to override any remaining styles
    const style = document.createElement('style');
    style.id = 'export-override-styles';
    style.textContent = `
      /* Text elements - clean cyan with no effects */
      #${elementId} textarea,
      #${elementId} [contenteditable] {
        color: #00ffff !important;
        text-shadow: none !important;
        filter: none !important;
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
        outline: none !important;
      }
      
      /* Icon elements - completely clean styling to match text */
      #${elementId} [data-element-type="icon"],
      #${elementId} [data-element-type="icon"] *,
      #${elementId} [data-element-type="icon"] > div,
      #${elementId} [data-element-type="icon"] svg,
      #${elementId} [data-element-type="icon"] svg *,
      #${elementId} svg,
      #${elementId} svg *,
      #${elementId} path,
      #${elementId} circle,
      #${elementId} rect,
      #${elementId} polygon,
      #${elementId} g,
      #${elementId} line,
      #${elementId} ellipse {
        fill: #00ffff !important;
        stroke: #00ffff !important;
        color: #00ffff !important;
        filter: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
        drop-shadow: none !important;
        transform: none !important;
        animation: none !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      /* Remove all glow effects from element wrappers */
      #${elementId} .element-wrapper,
      #${elementId} .element-wrapper > div {
        filter: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
        background: transparent !important;
      }
      
      /* Force visibility and proper sizing for all icon-related elements */
      #${elementId} [data-element-type="icon"],
      #${elementId} [data-element-type="icon"] > div,
      #${elementId} [data-element-type="icon"] svg,
      #${elementId} .element-wrapper svg {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        max-height: none !important;
        overflow: visible !important;
      }
      
      /* Ensure proper SVG scaling and prevent clipping */
      #${elementId} svg {
        width: 100% !important;
        height: 100% !important;
        viewBox: 0 0 24 24 !important;
        preserveAspectRatio: xMidYMid meet !important;
      }
      
      /* Remove any SVG filters specifically */
      #${elementId} svg defs,
      #${elementId} svg filter,
      #${elementId} feColorMatrix,
      #${elementId} feComponentTransfer,
      #${elementId} feFuncR,
      #${elementId} feFuncG,
      #${elementId} feFuncB {
        display: none !important;
      }
      
      /* Force icon containers to be properly sized and visible */
      #${elementId} [data-element-type="icon"] > div:first-child {
        width: 100% !important;
        height: 100% !important;
        position: static !important;
        overflow: visible !important;
      }
      
      /* Ensure icon wrapper divs don't interfere */
      #${elementId} [data-element-type="icon"] div {
        background: transparent !important;
        border: none !important;
        outline: none !important;
        overflow: visible !important;
      }
    `;
    document.head.appendChild(style);

    // Step 4: Wait for styles to apply and DOM to stabilize
    await new Promise(resolve => setTimeout(resolve, 500));

    // Additional debug: Take a snapshot of what we're about to export
    // console.log('=== PRE-EXPORT DOM SNAPSHOT ===');
    // console.log('Panel HTML (first 1000 chars):', panel.innerHTML.substring(0, 1000));

    // Check if the panel has the expected element structure
    const postStyleElementWrappers = panel.querySelectorAll('.element-wrapper');
    // console.log('Element wrappers after styling:', postStyleElementWrappers.length);
    postStyleElementWrappers.forEach((wrapper, _index) => {
      const hasIcon = wrapper.querySelector('[data-element-type="icon"]');
      const _hasSVG = wrapper.querySelector('svg');
      const _hasText = wrapper.querySelector('textarea');
      // console.log(`Wrapper ${index}: hasIcon=${!!hasIcon}, hasSVG=${!!hasSVG}, hasText=${!!hasText}`);

      if (hasIcon) {
        // console.log('Icon element found:', {
        //   dataset: hasIcon.dataset,
        //   innerHTML: hasIcon.innerHTML.substring(0, 200),
        //   computedStyle: window.getComputedStyle(hasIcon).opacity
        // });
      }
    });

    updateProgress(65, 'Capturing high-quality image...');

    // Configure export options with CORS handling
    const options = {
      quality: 1.0,
      pixelRatio: format === 'png' ? 3 : 1,
      skipFonts: true, // Skip font loading to avoid CORS issues
      backgroundColor: null,
      width: 800,
      height: 400,
      useCORS: false, // Disable CORS to avoid font loading issues
      allowTaint: false, // Disable taint to avoid CORS issues
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
        width: '800px',
        height: '400px',
      },
      filter: node => {
        // Debug: Log all nodes being processed (commented out to avoid console warnings and unused variables)
        // const nodeInfo = {
        //   tag: node.tagName,
        //   className: node.className,
        //   id: node.id,
        //   dataset: node.dataset,
        //   isElementWrapper: node.classList && node.classList.contains('element-wrapper'),
        //   isIcon: node.dataset && node.dataset.elementType === 'icon',
        //   isSVG: node.tagName === 'SVG',
        //   style: node.style && node.style.cssText ? node.style.cssText.substring(0, 100) : 'none'
        // };

        // Log important nodes (commented out to avoid console warnings)
        // if (nodeInfo.isElementWrapper || nodeInfo.isIcon || nodeInfo.isSVG || node.tagName === 'DIV') {
        //   console.log('Filter processing node:', nodeInfo);
        // }

        // Exclude UI elements that shouldn't be in export
        const excludeClasses = [
          'resize-handle',
          'react-resizable-handle',
          'selection-border',
          'distance-indicator',
          'snapping-guide',
        ];

        if (node.classList) {
          for (const className of excludeClasses) {
            if (node.classList.contains(className)) {
              // console.log('Excluding node due to class:', className, nodeInfo);
              return false;
            }
          }
        }

        // Exclude dashed borders (selection indicators)
        if (node.style && node.style.border && node.style.border.includes('dashed')) {
          // console.log('Excluding node due to dashed border:', nodeInfo);
          return false;
        }

        // Include everything else
        return true;
      },
    };

    updateProgress(75, 'Generating image data...');

    // Step 4: Perform the export with error handling
    let dataUrl;
    try {
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
    } catch (imageError) {
      console.error('HTML-to-image error:', imageError);
      // Try with more permissive settings
      const fallbackOptions = {
        ...options,
        skipFonts: true,
        useCORS: false,
        allowTaint: false,
        pixelRatio: 1,
        ignoreElements: element => {
          // Skip problematic elements
          return (
            element.classList &&
            (element.classList.contains('resize-handle') ||
              element.classList.contains('selection-border'))
          );
        },
      };
      dataUrl = await htmlToImage.toPng(panel, fallbackOptions);
    }

    updateProgress(85, 'Restoring original styling...');

    // Step 5: Remove override styles
    const overrideStyles = document.getElementById('export-override-styles');
    if (overrideStyles) {
      overrideStyles.remove();
    }

    // Step 6: Restore all saved styles to their original state

    // Restore panel wrapper styles
    if (savedPanelStyles.panelWrapper) {
      const { element, filter, background, boxShadow } = savedPanelStyles.panelWrapper;
      element.style.filter = filter || '';
      element.style.background = background || '';
      element.style.boxShadow = boxShadow || '';
    }

    // Restore LED border and glow element styles
    savedElementStyles.forEach(state => {
      const { element, filter, background, boxShadow, opacity } = state;
      element.style.filter = filter || '';
      element.style.background = background || '';
      element.style.boxShadow = boxShadow || '';
      element.style.opacity = opacity || '';
    });

    // Restore text element styles
    savedTextStyles.forEach(state => {
      const {
        element,
        originalOpacity,
        originalVisibility,
        originalBorder,
        originalOutline,
        originalDisplay,
        originalFilter,
        originalColor,
        originalTextShadow,
        originalAnimation,
        originalBackground,
        originalBackgroundColor,
      } = state;
      element.style.opacity = originalOpacity || '';
      element.style.visibility = originalVisibility || '';
      element.style.border = originalBorder || '';
      element.style.outline = originalOutline || '';
      element.style.display = originalDisplay || '';
      element.style.filter = originalFilter || '';
      element.style.color = originalColor || '';
      element.style.textShadow = originalTextShadow || '';
      element.style.animation = originalAnimation || '';
      element.style.background = originalBackground || '';
      element.style.backgroundColor = originalBackgroundColor || '';
      // Remove any forced important styles
      element.style.removeProperty('color');
      if (originalColor) element.style.setProperty('color', originalColor);
    });

    // Restore icon element styles
    savedIconStyles.forEach(state => {
      const {
        element,
        originalFilter,
        originalColor,
        originalFill,
        originalStroke,
        originalAnimation,
        originalOpacity,
      } = state;
      element.style.filter = originalFilter || '';
      element.style.animation = originalAnimation || '';
      element.style.opacity = originalOpacity || '';

      // Remove forced important styles first
      element.style.removeProperty('color');
      element.style.removeProperty('fill');
      element.style.removeProperty('stroke');

      // Then restore original values
      if (originalColor) element.style.setProperty('color', originalColor);

      // Restore fill and stroke (both style and attribute)
      if (originalFill !== null) {
        if (
          originalFill.startsWith('#') ||
          originalFill.startsWith('rgb') ||
          originalFill === 'none'
        ) {
          element.setAttribute('fill', originalFill);
        } else {
          element.style.fill = originalFill || '';
        }
      }

      if (originalStroke !== null) {
        if (
          originalStroke.startsWith('#') ||
          originalStroke.startsWith('rgb') ||
          originalStroke === 'none'
        ) {
          element.setAttribute('stroke', originalStroke);
        } else {
          element.style.stroke = originalStroke || '';
        }
      }

      // Remove any export-specific attributes
      if (element.removeAttribute) {
        element.removeAttribute('data-export-color');
      }
    });

    // Restore SVG filter elements
    savedFilterStyles.forEach(state => {
      const { element, originalDisplay } = state;
      element.style.display = originalDisplay || '';
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
    try {
      // Remove override styles first
      const overrideStyles = document.getElementById('export-override-styles');
      if (overrideStyles) {
        overrideStyles.remove();
      }

      const panel = document.getElementById(elementId);
      if (panel) {
        // Restore panel wrapper styles
        if (savedPanelStyles.panelWrapper) {
          const { element, filter, background, boxShadow } = savedPanelStyles.panelWrapper;
          element.style.filter = filter || '';
          element.style.background = background || '';
          element.style.boxShadow = boxShadow || '';
        }

        // Restore element styles
        savedElementStyles.forEach(state => {
          const { element, filter, background, boxShadow, opacity } = state;
          element.style.filter = filter || '';
          element.style.background = background || '';
          element.style.boxShadow = boxShadow || '';
          element.style.opacity = opacity || '';
        });

        // Restore text styles
        savedTextStyles.forEach(state => {
          const { element, originalFilter, originalColor, originalTextShadow, originalAnimation } =
            state;
          element.style.filter = originalFilter || '';
          element.style.color = originalColor || '';
          element.style.textShadow = originalTextShadow || '';
          element.style.animation = originalAnimation || '';
        });

        // Restore icon styles
        savedIconStyles.forEach(state => {
          const {
            element,
            originalFilter,
            originalColor,
            originalFill,
            originalStroke,
            originalAnimation,
            originalOpacity,
          } = state;
          element.style.filter = originalFilter || '';
          element.style.color = originalColor || '';
          element.style.animation = originalAnimation || '';
          element.style.opacity = originalOpacity || '';

          // Restore fill and stroke (both style and attribute)
          if (originalFill !== null) {
            if (
              originalFill.startsWith('#') ||
              originalFill.startsWith('rgb') ||
              originalFill === 'none'
            ) {
              element.setAttribute('fill', originalFill);
            } else {
              element.style.fill = originalFill || '';
            }
          }

          if (originalStroke !== null) {
            if (
              originalStroke.startsWith('#') ||
              originalStroke.startsWith('rgb') ||
              originalStroke === 'none'
            ) {
              element.setAttribute('stroke', originalStroke);
            } else {
              element.style.stroke = originalStroke || '';
            }
          }
        });

        // Restore SVG filter elements in error case too
        if (typeof savedFilterStyles !== 'undefined') {
          savedFilterStyles.forEach(state => {
            const { element, originalDisplay } = state;
            element.style.display = originalDisplay || '';
          });
        }
      }
    } catch (restoreError) {
      console.error('Failed to restore styles after export error:', restoreError);
    }

    throw error;
  }
};
