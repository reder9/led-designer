import React, { useState, useEffect } from 'react';
import { iconComponentMap } from '../utils/iconMap.jsx';
import { icons } from '../utils/icons';
import { exportImage } from '../utils/exportImage';
import IconControls from './sidebar/IconControls';
import TextControls from './sidebar/TextControls';
import ExportModal from './ExportModal';
import '../styles/fonts.css';

export default function SidebarLeft({
  elements,
  selectedElement,
  setElements,
  setSelectedElement,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  roundedEdges,
  setRoundedEdges,
  saveToHistory,
  _isPowerOn,
  _textGlowIntensity,
  _setTextGlowIntensity,
  _glowColor,
  _setGlowColor,
  _glowMode,
  _setGlowMode,
  borderRadius,
  setBorderRadius,
  width,
  height,
  _showLedBorder,
  _setShowLedBorder,
  _setShowExportModal,
  _showingKeyboardShortcuts,
  _setShowingKeyboardShortcuts,
}) {
  // Create a simple saveToHistory function since it might not be available
  const _actualSaveToHistory = saveToHistory || (() => {});
  const [fontSizeInput, setFontSizeInput] = useState(fontSize.toString());
  const [activeIconCategory, setActiveIconCategory] = useState('Social');
  const [iconSymbols, setIconSymbols] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [noSpaceWarning, setNoSpaceWarning] = useState(false);

  // Handle export with loading modal
  const handleExport = async (_format, _message) => {
    try {
      setIsExporting(true);
      setExportProgress(0);

      // Clear any selected element to ensure no UI elements appear in export
      setSelectedElement(null);

      await exportImage('panel-wrapper', 'png', (progress, _message) => {
        setExportProgress(progress);
      });

      // Keep modal visible briefly to show completion
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 800);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
      // You could add error toast notification here
    }
  };

  const fontOptions = [
    // Modern Gaming/Streaming Fonts
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

    // Retro/Pixel Fonts
    { name: 'Press Start 2P', style: 'font-press-start', category: 'Retro' },
    { name: 'VT323', style: 'font-vt323', category: 'Retro' },
    { name: 'Share Tech Mono', style: 'font-share-tech', category: 'Retro' },

    // Futuristic/Tech Fonts
    { name: 'Iceland', style: 'font-iceland', category: 'Tech' },
    { name: 'Syncopate', style: 'font-syncopate', category: 'Tech' },
    { name: 'Wallpoet', style: 'font-wallpoet', category: 'Tech' },
    { name: 'Nova Square', style: 'font-nova-square', category: 'Tech' },
    { name: 'Michroma', style: 'font-michroma', category: 'Tech' },

    // Decorative Fonts
    { name: 'Stalinist One', style: 'font-stalinist', category: 'Decorative' },
    { name: 'Rubik Mono One', style: 'font-rubik-mono', category: 'Decorative' },
    { name: 'Faster One', style: 'font-faster-one', category: 'Decorative' },
    { name: 'Monoton', style: 'font-monoton', category: 'Decorative' },

    // System Fonts
    { name: 'Arial', style: '', category: 'System' },
    { name: 'Impact', style: '', category: 'System' },
  ];

  // Update local input when fontSize prop changes
  useEffect(() => {
    setFontSizeInput(fontSize.toString());
  }, [fontSize]);

  // Helper function to find a free space for new elements
  const findFreeSpace = (elementWidth, elementHeight) => {
    const gridSize = 20;
    const maxAttempts = 200;
    const panelWidth = width || 800;
    const panelHeight = height || 400;
    const padding = 10;
    const buffer = 5; // Match the buffer used in collision detection

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = (attempt % 10) * gridSize + padding;
      const y = Math.floor(attempt / 10) * gridSize + padding;

      if (x + elementWidth > panelWidth - padding || y + elementHeight > panelHeight - padding) {
        continue;
      }

      const wouldCollide = elements.some(el => {
        return !(
          x + elementWidth + buffer <= el.x ||
          x >= el.x + el.width + buffer ||
          y + elementHeight + buffer <= el.y ||
          y >= el.y + el.height + buffer
        );
      });

      if (!wouldCollide) {
        return { x, y };
      }
    }

    for (let y = padding; y < panelHeight - elementHeight - padding; y += gridSize) {
      for (let x = padding; x < panelWidth - elementWidth - padding; x += gridSize) {
        const wouldCollide = elements.some(el => {
          return !(
            x + elementWidth + buffer <= el.x ||
            x >= el.x + el.width + buffer ||
            y + elementHeight + buffer <= el.y ||
            y >= el.y + el.height + buffer
          );
        });

        if (!wouldCollide) {
          return { x, y };
        }
      }
    }

    return null; // No free space available
  };

  const addText = () => {
    const elementSize = { width: 120, height: 40 };
    const position = findFreeSpace(elementSize.width, elementSize.height);

    if (!position) {
      // No space available, show warning
      setNoSpaceWarning(true);
      setTimeout(() => setNoSpaceWarning(false), 3000);
      return;
    }

    const newElement = {
      id: Date.now(),
      type: 'text',
      content: 'Edit me',
      x: position.x,
      y: position.y,
      width: elementSize.width,
      height: elementSize.height,
      fontFamily,
      fontSize,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      rotation: 0, // Add rotation property
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const addIcon = iconName => {
    const defaultKey = iconName || Object.keys(iconComponentMap)[0];
    const elementSize = { width: 60, height: 60 };
    const position = findFreeSpace(elementSize.width, elementSize.height);

    if (!position) {
      // No space available, show warning
      setNoSpaceWarning(true);
      setTimeout(() => setNoSpaceWarning(false), 3000);
      return;
    }

    const newElement = {
      id: Date.now(),
      type: 'icon',
      content: defaultKey,
      iconKey: defaultKey,
      x: position.x,
      y: position.y,
      width: elementSize.width,
      height: elementSize.height,
      rotation: 0, // Add rotation property
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const selectedEl = elements.find(el => el.id === selectedElement);
  const selectedIcon = selectedEl?.type === 'icon' ? selectedEl : null;
  const selectedText = selectedEl?.type === 'text' ? selectedEl : null;

  // Sync fontSize state with selected text element
  useEffect(() => {
    if (selectedText && selectedText.fontSize) {
      const currentFontSize = parseInt(selectedText.fontSize) || 16;
      setFontSize(currentFontSize);
      setFontSizeInput(currentFontSize.toString());
    }
  }, [selectedText?.fontSize, selectedElement, selectedText, setFontSize]);

  // Sync fontFamily state with selected text element
  useEffect(() => {
    if (selectedText && selectedText.fontFamily) {
      setFontFamily(selectedText.fontFamily);
    }
  }, [selectedText?.fontFamily, selectedElement, selectedText, setFontFamily]);

  const updateIconContent = iconName => {
    if (selectedElement) {
      setElements(
        elements.map(el =>
          el.id === selectedElement && el.type === 'icon'
            ? { ...el, content: iconName, iconKey: iconName }
            : el
        )
      );
    }
  };

  const updateFontFamily = family => {
    setFontFamily(family);
    if (selectedElement) {
      setElements(
        elements.map(el => (el.id === selectedElement ? { ...el, fontFamily: family } : el))
      );
    }
  };

  const updateFontSize = size => {
    const newSize = Math.max(8, Math.min(200, size));
    setFontSize(newSize);
    setFontSizeInput(newSize.toString());
    if (selectedElement) {
      setElements(
        elements.map(el => (el.id === selectedElement ? { ...el, fontSize: newSize } : el))
      );
    }
  };

  const updateTextFormat = (property, value) => {
    if (selectedElement && selectedText) {
      setElements(
        elements.map(el => (el.id === selectedElement ? { ...el, [property]: value } : el))
      );
    }
  };

  const toggleBold = () => {
    if (selectedText) {
      updateTextFormat('fontWeight', selectedText.fontWeight === 'bold' ? 'normal' : 'bold');
    }
  };

  const toggleItalic = () => {
    if (selectedText) {
      updateTextFormat('fontStyle', selectedText.fontStyle === 'italic' ? 'normal' : 'italic');
    }
  };

  const setTextAlignment = alignment => {
    updateTextFormat('textAlign', alignment);
  };

  const updateRotation = rotation => {
    if (selectedElement) {
      const clampedRotation = Math.max(-180, Math.min(180, rotation));
      setElements(
        elements.map(el => (el.id === selectedElement ? { ...el, rotation: clampedRotation } : el))
      );
    }
  };

  const handleFontSizeInputChange = e => {
    setFontSizeInput(e.target.value);
  };

  const handleFontSizeInputBlur = () => {
    const value = parseInt(fontSizeInput);
    if (!isNaN(value)) {
      updateFontSize(value);
    } else {
      setFontSizeInput(fontSize.toString());
    }
  };

  const handleFontSizeInputKeyPress = e => {
    if (e.key === 'Enter') {
      handleFontSizeInputBlur();
    }
  };

  // Load icon paths when component mounts
  useEffect(() => {
    const extractSvgContent = async svgUrl => {
      try {
        const response = await fetch(svgUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');

        const pathElement = doc.querySelector('path');
        if (pathElement?.getAttribute('d')) {
          return pathElement.getAttribute('d');
        }

        const svgElement = doc.querySelector('svg');
        return svgElement?.innerHTML || null;
      } catch (error) {
        console.error('Error extracting SVG content:', error);
        return null;
      }
    };

    const loadIconPaths = async () => {
      try {
        const symbolPromises = Object.entries(icons).map(async ([key, src]) => {
          try {
            const svgContent = await extractSvgContent(src);

            if (!svgContent) {
              return '';
            }

            return `
              <symbol id="icon-${key}" viewBox="0 0 24 24">
                ${svgContent.includes('<path') ? svgContent : `<path d="${svgContent}"/>`}
              </symbol>
            `;
          } catch (error) {
            console.error(`Error loading icon ${key}:`, error);
            return '';
          }
        });

        const symbols = await Promise.all(symbolPromises);
        const validSymbols = symbols.filter(symbol => symbol.trim() !== '');

        const symbolsHtml = `
          <svg style="display: none;">
            <defs>
              ${validSymbols.join('')}
            </defs>
          </svg>
        `;

        setIconSymbols(symbolsHtml);
      } catch (error) {
        console.error('Error loading icon symbols:', error);
      }
    };

    loadIconPaths();
  }, []);

  return (
    <div className='w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-full'>
      {/* SVG Symbol Definitions */}
      <div dangerouslySetInnerHTML={{ __html: iconSymbols }} />

      {/* Scrollable Content Area */}
      <div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
        <div className='space-y-6'>
          {/* Modern Element Creation */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-blue-400 mb-3'>Create Elements</h3>

            <div className='grid grid-cols-2 gap-3'>
              <button
                onClick={addText}
                className='group relative flex flex-col items-center p-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5'
              >
                <div className='w-10 h-10 mb-2 bg-white/20 group-hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors'>
                  <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                  </svg>
                </div>
                <span className='text-white text-sm font-medium'>Add Text</span>
              </button>

              <button
                onClick={() => addIcon()}
                className='group relative flex flex-col items-center p-4 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:-translate-y-0.5'
              >
                <div className='w-10 h-10 mb-2 bg-white/20 group-hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors'>
                  <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <span className='text-white text-sm font-medium'>Add Icon</span>
              </button>
            </div>
          </div>

          {/* Text Controls */}
          {selectedText && (
            <TextControls
              selectedText={selectedText}
              toggleBold={toggleBold}
              toggleItalic={toggleItalic}
              setTextAlignment={setTextAlignment}
              fontOptions={fontOptions}
              updateFontFamily={updateFontFamily}
              fontFamily={fontFamily}
              fontSize={fontSize}
              fontSizeInput={fontSizeInput}
              handleFontSizeInputChange={handleFontSizeInputChange}
              handleFontSizeInputBlur={handleFontSizeInputBlur}
              handleFontSizeInputKeyPress={handleFontSizeInputKeyPress}
              decrementFontSize={() => updateFontSize(fontSize - 1)}
              incrementFontSize={() => updateFontSize(fontSize + 1)}
              updateRotation={updateRotation}
            />
          )}

          {/* Icon Controls */}
          {selectedIcon && (
            <IconControls
              activeIconCategory={activeIconCategory}
              setActiveIconCategory={setActiveIconCategory}
              updateIconContent={updateIconContent}
              selectedElement={selectedElement}
              selectedIcon={selectedIcon}
              updateRotation={updateRotation}
            />
          )}

          {/* Settings Section (moved to scrollable area) */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-blue-400'>Settings</h3>

            <div className='space-y-3'>
              <label className='flex items-center space-x-3 cursor-pointer group'>
                <div className='relative'>
                  <input
                    type='checkbox'
                    checked={roundedEdges}
                    onChange={e => setRoundedEdges(e.target.checked)}
                    className='sr-only'
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all ${
                      roundedEdges
                        ? 'bg-cyan-500 border-cyan-500'
                        : 'border-gray-600 group-hover:border-gray-500'
                    }`}
                  >
                    {roundedEdges && (
                      <svg
                        className='w-3 h-3 text-white absolute top-0.5 left-0.5'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className='text-gray-300 text-sm group-hover:text-gray-200 transition-colors'>
                  Rounded Edges
                </span>
              </label>

              {/* Border Radius Slider - only show when rounded edges is enabled */}
              {roundedEdges && (
                <div className='ml-8 space-y-2'>
                  <label className='block text-xs text-gray-400'>
                    Corner Radius: {borderRadius}px
                  </label>
                  <input
                    type='range'
                    min='5'
                    max='50'
                    value={borderRadius}
                    onChange={e => setBorderRadius(parseInt(e.target.value))}
                    className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((borderRadius - 5) / 45) * 100}%, #374151 ${((borderRadius - 5) / 45) * 100}%, #374151 100%)`,
                    }}
                  />
                  <div className='flex justify-between text-xs text-gray-500'>
                    <span>5px</span>
                    <span>50px</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Export Section */}
      <div className='border-t border-gray-700 p-4 bg-gray-800 shadow-lg shadow-gray-900/50'>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`w-full group relative flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5 font-medium ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          <svg
            className='w-5 h-5 mr-2 group-hover:scale-110 transition-transform'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
          {isExporting ? 'Exporting...' : 'Export as PNG'}
        </button>
      </div>

      {/* Export Modal */}
      <ExportModal isVisible={isExporting} progress={exportProgress} />

      {/* No Space Warning */}
      {noSpaceWarning && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 shadow-2xl max-w-md mx-4'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
                <svg
                  className='w-5 h-5 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>No Space Available</h3>
            </div>
            <p className='text-gray-600 mb-4'>
              The canvas is full! Please delete some elements or move existing ones to make space
              for new items.
            </p>
            <button
              onClick={() => setNoSpaceWarning(false)}
              className='w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200'
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
