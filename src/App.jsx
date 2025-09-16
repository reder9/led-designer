import { useState, useEffect, useRef } from 'react';
import Panel from './components/Panel';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import './index.css';

export default function App() {
  const baseWidth = 800;
  const baseHeight = 400;

  const [elements, setElements] = useState([]);
  const [glowColor, setGlowColor] = useState('#00faff');
  const [roundedEdges, setRoundedEdges] = useState(false);
  const [borderRadius, setBorderRadius] = useState(20);
  const [selectedElement, setSelectedElement] = useState(null);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(32);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [textGlowIntensity, setTextGlowIntensity] = useState(1.0);
  const [glowMode, setGlowMode] = useState('rainbow');
  const [showLedBorder, setShowLedBorder] = useState(true);
  const [speed, setSpeed] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState('panel'); // 'panel', 'tools', 'controls'
  const [hasInitializedElements, setHasInitializedElements] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Simple placeholder for saveToHistory - implement useHistory hook if needed
  const saveToHistory = () => {
    // TODO: Implement history functionality
  };

  const sidebarRef = useRef(null);

  // Detect mobile and calculate dynamic dimensions
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Force re-render to update panel dimensions
      setElements(prevElements => [...prevElements]);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate mobile panel dimensions dynamically
  const getMobilePanelDimensions = () => {
    if (!isMobile || typeof window === 'undefined') return { width: baseWidth, height: baseHeight };

    const screenWidth = window.innerWidth;
    const padding = 24; // Total horizontal padding (12px on each side)
    const availableWidth = screenWidth - padding;

    // Use 90% of available width, ensuring minimum and maximum sizes
    const mobileWidth = Math.min(Math.max(availableWidth * 0.9, 300), 600);
    const mobileHeight = mobileWidth / 2; // Maintain 2:1 ratio

    return { width: mobileWidth, height: mobileHeight };
  };

  const { width: panelWidth, height: panelHeight } = getMobilePanelDimensions();

  // Initialize placeholder text with dynamic positioning (only once)
  useEffect(() => {
    // Only create the initial element if we haven't initialized elements yet
    if (!hasInitializedElements) {
      const textWidth = isMobile ? Math.min(panelWidth * 0.8, 300) : 400;
      const textHeight = isMobile ? 40 : 60;
      const fontSize = isMobile ? Math.max(panelWidth / 30, 14) : 32; // Smaller font for mobile

      const placeholderElement = {
        id: Date.now(),
        type: 'text',
        content: 'Customize your LED panel',
        x: (panelWidth - textWidth) / 2, // Properly center horizontally
        y: (panelHeight - textHeight) / 2, // Properly center vertically
        width: textWidth,
        height: textHeight,
        fontFamily: 'Impact',
        fontSize,
      };
      setElements([placeholderElement]);
      setSelectedElement(placeholderElement.id);
      setHasInitializedElements(true);
    }
  }, [panelWidth, panelHeight, isMobile, hasInitializedElements]);

  // Mirror body scroll into sidebar scroll (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      if (sidebarRef.current) {
        sidebarRef.current.scrollTop = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Expand body height to match sidebar scroll height (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const updateBodyHeight = () => {
      if (sidebarRef.current) {
        document.body.style.height = `${sidebarRef.current.scrollHeight}px`;
      }
    };
    updateBodyHeight();
    window.addEventListener('resize', updateBodyHeight);
    return () => window.removeEventListener('resize', updateBodyHeight);
  }, [isMobile]);

  // Show welcome modal on desktop only
  useEffect(() => {
    // Only show if user hasn't explicitly dismissed it
    const hasDismissedWelcome = localStorage.getItem('dismissedWelcomeModal');
    if (!isMobile && !hasDismissedWelcome) {
      setShowWelcomeModal(true);
    }
  }, [isMobile]);

  return (
    <div className='h-screen flex flex-col overflow-hidden fixed inset-0'>
      {/* Main Content */}
      {isMobile ? (
        // --- ENHANCED MOBILE LAYOUT ---
        <div className='flex-1 flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden'>
          {/* Mobile Panel - Always visible at top */}
          <div
            className={`flex-none bg-gray-900 border-b border-gray-700 ${isMobile ? 'p-4' : 'p-3'}`}
          >
            <div className='w-full flex justify-center'>
              <div
                className={`relative bg-black rounded-xl ${isMobile ? 'overflow-visible' : 'overflow-hidden'}`}
                style={{
                  width: `${panelWidth}px`,
                  height: `${panelHeight}px`,
                  maxWidth: '100%',
                  // Add subtle margin on mobile to accommodate the glow
                  margin: isMobile ? '10px' : '0px',
                }}
              >
                <Panel
                  elements={elements}
                  setElements={setElements}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                  glowColor={glowColor}
                  isPowerOn={isPowerOn}
                  roundedEdges={roundedEdges}
                  borderRadius={borderRadius}
                  width={panelWidth}
                  height={panelHeight}
                  glowMode={glowMode}
                  brightness={brightness}
                  speed={speed}
                  showLedBorder={showLedBorder}
                  textGlowIntensity={textGlowIntensity}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </div>

          {/* Mobile Content Area - Tabbed */}
          <div className='flex-1 flex flex-col overflow-hidden'>
            {mobileActiveTab === 'panel' && (
              <div className='flex-1 flex flex-col items-center justify-center p-6 text-center'>
                <div className='mb-6'>
                  <h2 className='text-xl font-bold text-white mb-2'>LED Panel Designer</h2>
                  <p className='text-gray-400'>Tap the tabs below to start creating your design</p>
                </div>
                <div className='space-y-3 text-gray-300'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-blue-500 rounded text-center text-sm font-bold'>
                      1
                    </div>
                    <span>Tap "Tools" to add text and icons</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-purple-500 rounded text-center text-sm font-bold'>
                      2
                    </div>
                    <span>Use "Controls" to adjust colors and effects</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-green-500 rounded text-center text-sm font-bold'>
                      3
                    </div>
                    <span>Export your design when ready</span>
                  </div>
                </div>
              </div>
            )}

            {mobileActiveTab === 'tools' && (
              <div className='flex-1 overflow-y-auto bg-gray-800 mobile-tools-container'>
                <SidebarLeft
                  elements={elements}
                  setElements={setElements}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                  fontFamily={fontFamily}
                  setFontFamily={setFontFamily}
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  roundedEdges={roundedEdges}
                  setRoundedEdges={setRoundedEdges}
                  saveToHistory={saveToHistory}
                  isPowerOn={isPowerOn}
                  textGlowIntensity={textGlowIntensity}
                  setTextGlowIntensity={setTextGlowIntensity}
                  borderRadius={borderRadius}
                  setBorderRadius={setBorderRadius}
                  glowColor={glowColor}
                  setGlowColor={setGlowColor}
                  glowMode={glowMode}
                  setGlowMode={setGlowMode}
                  width={baseWidth}
                  height={baseHeight}
                  showLedBorder={showLedBorder}
                  setShowLedBorder={setShowLedBorder}
                />
              </div>
            )}

            {mobileActiveTab === 'controls' && (
              <div className='flex-1 overflow-y-auto bg-gray-800 mobile-controls-container'>
                <SidebarRight
                  glowColor={glowColor}
                  setGlowColor={setGlowColor}
                  isPowerOn={isPowerOn}
                  setIsPowerOn={setIsPowerOn}
                  brightness={brightness}
                  setBrightness={setBrightness}
                  glowMode={glowMode}
                  setGlowMode={setGlowMode}
                  speed={speed}
                  setSpeed={setSpeed}
                />
              </div>
            )}
          </div>

          {/* Mobile Bottom Navigation */}
          <div className='mobile-bottom-nav'>
            <div className='flex bg-gray-900'>
              <button
                onClick={() => setMobileActiveTab('panel')}
                className={`mobile-nav-item ${mobileActiveTab === 'panel' ? 'active' : ''}`}
              >
                <svg className='w-5 h-5 mb-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                  <circle cx='9' cy='9' r='2' />
                  <path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
                </svg>
                Preview
              </button>

              <button
                onClick={() => setMobileActiveTab('tools')}
                className={`mobile-nav-item ${mobileActiveTab === 'tools' ? 'active' : ''}`}
              >
                <svg className='w-5 h-5 mb-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 19l7-7 3 3-7 7-3-3z' />
                  <path d='m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z' />
                  <path d='m2 2 7.586 7.586' />
                  <circle cx='11' cy='11' r='2' />
                </svg>
                Tools
              </button>

              <button
                onClick={() => setMobileActiveTab('controls')}
                className={`mobile-nav-item ${mobileActiveTab === 'controls' ? 'active' : ''}`}
              >
                <svg className='w-5 h-5 mb-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <circle cx='12' cy='12' r='3' />
                  <path d='M12 1v6m0 6v6m11-7h-6m-6 0H1' />
                </svg>
                Controls
              </button>
            </div>
          </div>
        </div>
      ) : (
        // --- DESKTOP LAYOUT: Left Sidebar → Panel → Right Sidebar
        <div className='flex flex-1 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden'>
          {/* Left Sidebar */}
          <div className='w-80 bg-gray-900 flex-shrink-0 overflow-hidden'>
            <SidebarLeft
              elements={elements}
              setElements={setElements}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
              fontSize={fontSize}
              setFontSize={setFontSize}
              roundedEdges={roundedEdges}
              setRoundedEdges={setRoundedEdges}
              saveToHistory={saveToHistory}
              isPowerOn={isPowerOn}
              textGlowIntensity={textGlowIntensity}
              setTextGlowIntensity={setTextGlowIntensity}
              borderRadius={borderRadius}
              setBorderRadius={setBorderRadius}
              glowColor={glowColor}
              setGlowColor={setGlowColor}
              glowMode={glowMode}
              setGlowMode={setGlowMode}
              width={baseWidth}
              height={baseHeight}
              showLedBorder={showLedBorder}
              setShowLedBorder={setShowLedBorder}
            />
          </div>

          {/* Center Panel */}
          <div className='flex-1 flex flex-col items-center justify-center border-x border-gray-700 overflow-hidden'>
            <div className='w-full max-w-5xl flex justify-center items-center p-6'>
              <div className='relative w-full aspect-[2/1] flex items-center justify-center'>
                <Panel
                  elements={elements}
                  setElements={setElements}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                  glowColor={glowColor}
                  isPowerOn={isPowerOn}
                  roundedEdges={roundedEdges}
                  borderRadius={borderRadius}
                  width={baseWidth}
                  height={baseHeight}
                  glowMode={glowMode}
                  brightness={brightness}
                  speed={speed}
                  showLedBorder={showLedBorder}
                  textGlowIntensity={textGlowIntensity}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div ref={sidebarRef} className='w-80 bg-gray-800 flex-shrink-0 overflow-hidden'>
            <SidebarRight
              glowColor={glowColor}
              setGlowColor={setGlowColor}
              isPowerOn={isPowerOn}
              setIsPowerOn={setIsPowerOn}
              brightness={brightness}
              setBrightness={setBrightness}
              glowMode={glowMode}
              setGlowMode={setGlowMode}
              speed={speed}
              setSpeed={setSpeed}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className='bg-gray-900 border-t border-gray-800 py-3 px-4 flex-shrink-0'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left'>
          <div className='flex items-center justify-center md:justify-start mb-3 md:mb-0'>
            <span className='text-sm font-medium bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mr-2'>
              LED Panel Designer
            </span>
            <span className='text-gray-400 mr-2'>- Created by</span>
            <span className='font-semibold text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
              RederSoft
            </span>
          </div>

          <a
            href='https://www.etsy.com/shop/RederCraft'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25'
          >
            Visit Our Etsy Shop
          </a>
        </div>
      </footer>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />

      {/* Welcome Modal for Desktop */}
      {showWelcomeModal && !isMobile && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700/50'>
            <div className='p-8 text-center'>
              {/* Header */}
              <div className='mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                    <circle cx='9' cy='9' r='2' />
                    <path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
                  </svg>
                </div>
                <h2 className='text-2xl font-bold text-white mb-2'>Welcome to LED Designer</h2>
                <p className='text-gray-400'>Create stunning LED panel displays in minutes</p>
              </div>

              {/* Quick Tips */}
              <div className='space-y-3 mb-8 text-left'>
                <div className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0'></div>
                  <p className='text-gray-300 text-sm'>
                    <strong className='text-white'>Left sidebar:</strong> Add text and icons
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0'></div>
                  <p className='text-gray-300 text-sm'>
                    <strong className='text-white'>Right sidebar:</strong> Control LED effects
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0'></div>
                  <p className='text-gray-300 text-sm'>
                    <strong className='text-white'>Double-click text</strong> to edit content
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0'></div>
                  <p className='text-gray-300 text-sm'>
                    <strong className='text-white'>Export</strong> when ready to build
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className='space-y-4'>
                <label className='flex items-center text-sm text-gray-300 cursor-pointer'>
                  <input
                    type='checkbox'
                    className='mr-3 w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2'
                    onChange={e => {
                      // Store the checkbox state but don't dismiss yet
                      if (e.target.checked) {
                        e.target.dataset.shouldDismiss = 'true';
                      } else {
                        e.target.dataset.shouldDismiss = 'false';
                      }
                    }}
                  />
                  Don't show me again
                </label>
                <button
                  onClick={e => {
                    const checkbox = e.target
                      .closest('.space-y-4')
                      .querySelector('input[type="checkbox"]');
                    setShowWelcomeModal(false);
                    if (checkbox && checkbox.checked) {
                      localStorage.setItem('dismissedWelcomeModal', 'true');
                    }
                  }}
                  className='w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]'
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
