import React, { useState, useEffect } from 'react';
import { iconComponentMap } from '../utils/iconMap.jsx';
import { exportAsImage } from '../utils/exportImage';
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
  glowColor,
  setGlowColor,
  glowMode,
  setGlowMode,
  borderRadius,
  setBorderRadius,
  width,
  height,
  _showLedBorder,
  _setShowLedBorder,
  _setShowExportModal,
  _showingKeyboardShortcuts,
  _setShowingKeyboardShortcuts,
  isMobile = false,
}) {
  // Create a simple saveToHistory function since it might not be available
  const _actualSaveToHistory = saveToHistory || (() => {});
  const [iconSymbols, setIconSymbols] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [noSpaceWarning, setNoSpaceWarning] = useState(false);

  // Handle export with loading modal
  const handleExport = async (_format, _message) => {
    try {
      setIsExporting(true);
      setExportProgress(25);

      // Set export mode with pink color and no glow effects
      const originalGlowColor = glowColor;
      const originalGlowMode = glowMode;

      setGlowColor('#ff69b4'); // Pink color
      setGlowMode('export'); // Special export mode that disables glow effects

      setExportProgress(50);

      // Small delay to ensure the color change is applied
      await new Promise(resolve => setTimeout(resolve, 100));

      setExportProgress(75);

      // Capture the image
      const blob = await exportAsImage('panel', 'png');

      // Restore original settings
      setGlowColor(originalGlowColor);
      setGlowMode(originalGlowMode);

      setExportProgress(100);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'led-panel.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Keep modal visible briefly to show completion
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 800);
    } catch (error) {
      console.error('Export failed:', error);

      // Restore original settings even on error
      if (glowColor !== '#ff69b4' || glowMode !== 'export') {
        setGlowColor('#00faff');
        setGlowMode('rainbow');
      }

      setIsExporting(false);
      setExportProgress(0);
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
    { name: 'Exo 2', style: 'font-exo-2', category: 'Tech' },
    { name: 'Saira Condensed', style: 'font-saira-condensed', category: 'Tech' },
  ];

  // Load icon symbols on component mount
  useEffect(() => {
    const svgSymbols = Object.entries(iconComponentMap)
      .map(([key, Component]) => {
        try {
          // Try to render the component to get its JSX
          const element = Component({});
          if (element?.props?.children) {
            return `<symbol id="${key}">${element.props.children}</symbol>`;
          }
        } catch (e) {
          console.warn(`Failed to load icon ${key}:`, e);
        }
        return '';
      })
      .filter(Boolean)
      .join('');

    if (svgSymbols) {
      setIconSymbols(`<svg style="display: none;"><defs>${svgSymbols}</defs></svg>`);
    }
  }, []);

  // Check if position is occupied by existing elements (with collision buffer)
  const isPositionOccupied = (x, y, width, height, excludeId = null) => {
    const buffer = 5; // Collision buffer
    return elements.some(el => {
      if (el.id === excludeId) return false;
      return !(
        x >= el.x + el.width + buffer ||
        x + width + buffer <= el.x ||
        y >= el.y + el.height + buffer ||
        y + height + buffer <= el.y
      );
    });
  };

  // Find the nearest free space to place a new element
  const findFreeSpace = (elementWidth, elementHeight) => {
    const buffer = 5;
    const step = 10;

    // Try positions starting from top-left, moving right then down
    for (let y = buffer; y <= height - elementHeight - buffer; y += step) {
      for (let x = buffer; x <= width - elementWidth - buffer; x += step) {
        if (!isPositionOccupied(x, y, elementWidth, elementHeight)) {
          return { x, y };
        }
      }
    }

    return null; // No space available
  };

  const addText = () => {
    const elementSize = { width: 200, height: 60 };
    const position = findFreeSpace(elementSize.width, elementSize.height);

    if (!position) {
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
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const addIcon = iconName => {
    const defaultKey = iconName || Object.keys(iconComponentMap)[0];
    const elementSize = { width: 60, height: 60 };
    const position = findFreeSpace(elementSize.width, elementSize.height);

    if (!position) {
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
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  if (isMobile) {
    return (
      <div className='w-full bg-gray-800'>
        {/* SVG Symbol Definitions */}
        <div dangerouslySetInnerHTML={{ __html: iconSymbols }} />

        <div className='flex gap-2 items-center justify-between p-2'>
          {/* Element Creation Buttons */}
          <div className='flex gap-2'>
            <button
              onClick={addText}
              className='flex items-center px-3 py-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all duration-200 text-white text-sm'
            >
              <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
              </svg>
              Text
            </button>

            <button
              onClick={() => addIcon()}
              className='flex items-center px-3 py-2 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg transition-all duration-200 text-white text-sm'
            >
              <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                  clipRule='evenodd'
                />
              </svg>
              Icon
            </button>
          </div>

          {/* Selected Element Controls */}
          {selectedEl && selectedEl.type === 'text' && (
            <div className='flex items-center gap-2 text-sm'>
              <select
                value={fontFamily}
                onChange={e => {
                  setFontFamily(e.target.value);
                  setElements(
                    elements.map(el =>
                      el.id === selectedElement ? { ...el, fontFamily: e.target.value } : el
                    )
                  );
                }}
                className='px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 text-xs'
              >
                {fontOptions.map(font => (
                  <option key={font.name} value={font.name}>
                    {font.name}
                  </option>
                ))}
              </select>

              <input
                type='number'
                value={fontSize}
                onChange={e => {
                  const newSize = parseInt(e.target.value) || 12;
                  setFontSize(newSize);
                  setElements(
                    elements.map(el =>
                      el.id === selectedElement ? { ...el, fontSize: newSize } : el
                    )
                  );
                }}
                className='w-16 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 text-xs'
                min='8'
                max='72'
              />
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={() => handleExport('png', 'Exporting PNG...')}
            disabled={isExporting}
            className='flex items-center px-3 py-2 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg transition-all duration-200 text-white text-sm disabled:opacity-50'
          >
            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
            {isExporting ? 'Exporting...' : 'Export'}
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

  // Desktop layout (existing full component)
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
          {selectedEl?.type === 'text' && (
            <div className='space-y-4'>
              <h3 className='text-sm font-semibold text-blue-400'>Text Settings</h3>

              {/* Font Family */}
              <div>
                <label className='text-sm text-gray-400 mb-2 block'>Font Family</label>
                <select
                  value={fontFamily}
                  onChange={e => {
                    setFontFamily(e.target.value);
                    setElements(
                      elements.map(el =>
                        el.id === selectedElement ? { ...el, fontFamily: e.target.value } : el
                      )
                    );
                  }}
                  className='w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600'
                >
                  {fontOptions.map(font => (
                    <option key={font.name} value={font.name}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className='text-sm text-gray-400 mb-2 block'>Font Size</label>
                <input
                  type='number'
                  value={fontSize}
                  onChange={e => {
                    const newSize = parseInt(e.target.value) || 12;
                    setFontSize(newSize);
                    setElements(
                      elements.map(el =>
                        el.id === selectedElement ? { ...el, fontSize: newSize } : el
                      )
                    );
                  }}
                  className='w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600'
                  min='8'
                  max='72'
                />
              </div>
            </div>
          )}

          {/* Panel Settings */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-green-400 mb-3'>Panel Settings</h3>

            {/* Rounded Edges Toggle */}
            <div className='flex items-center justify-between p-4 bg-gray-700 rounded-xl'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center'>
                  <svg className='w-4 h-4 text-green-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M5 2a2 2 0 00-2 2v1a1 1 0 002 0V4a1 1 0 011-1h1a1 1 0 000-2H5zM4 7a1 1 0 011-1h1a1 1 0 100-2H5a2 2 0 00-2 2v1a1 1 0 102 0V7zM7 8a1 1 0 100 2h6a1 1 0 100-2H7z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div>
                  <div className='text-sm font-medium text-white'>Rounded Edges</div>
                  <div className='text-xs text-gray-400'>Add rounded corners to the panel</div>
                </div>
              </div>
              <button
                onClick={() => setRoundedEdges(!roundedEdges)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  roundedEdges ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    roundedEdges ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Border Radius Slider */}
            {roundedEdges && (
              <div className='p-4 bg-gray-700 rounded-xl space-y-3'>
                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-white'>Border Radius</label>
                  <span className='text-xs text-green-400 font-medium'>{borderRadius}px</span>
                </div>
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
