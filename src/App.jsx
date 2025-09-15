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

  // Initialize placeholder text with dynamic positioning
  useEffect(() => {
    // Check if we already have elements to avoid resetting on every resize
    if (elements.length === 0) {
      const placeholderElement = {
        id: Date.now(),
        type: 'text',
        content: 'Customize your LED panel',
        x: Math.max(panelWidth / 2 - 200, 10),
        y: Math.max(panelHeight / 2 - 30, 10),
        width: Math.min(400, panelWidth - 20),
        height: 60,
        fontFamily: 'Impact',
        fontSize: isMobile ? Math.max(panelWidth / 25, 16) : 32, // Scale font size for mobile
      };
      setElements([placeholderElement]);
      setSelectedElement(placeholderElement.id);
    }
  }, [panelWidth, panelHeight, isMobile, elements.length]);

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

  return (
    <div className='h-screen flex flex-col overflow-hidden fixed inset-0'>
      {/* Main Content */}
      {isMobile ? (
        // --- ENHANCED MOBILE LAYOUT ---
        <div className='flex-1 flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden'>
          {/* Mobile Panel - Always visible at top */}
          <div className='flex-none bg-gray-900 border-b border-gray-700 p-3'>
            <div className='w-full flex justify-center'>
              <div
                className='relative bg-black rounded-xl overflow-hidden'
                style={{
                  width: `${panelWidth}px`,
                  height: `${panelHeight}px`,
                  maxWidth: '100%',
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
              <div className='flex-1 overflow-y-auto bg-gray-800'>
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
              <div className='flex-1 overflow-y-auto bg-gray-800 p-4'>
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
          <div className='flex-none bg-gray-900 border-t border-gray-700 safe-area-bottom'>
            <div className='flex'>
              <button
                onClick={() => setMobileActiveTab('panel')}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
                  mobileActiveTab === 'panel'
                    ? 'text-cyan-400 bg-gray-800 border-t-2 border-cyan-400'
                    : 'text-gray-400 hover:text-white'
                }`}
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
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
                  mobileActiveTab === 'tools'
                    ? 'text-cyan-400 bg-gray-800 border-t-2 border-cyan-400'
                    : 'text-gray-400 hover:text-white'
                }`}
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
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
                  mobileActiveTab === 'controls'
                    ? 'text-cyan-400 bg-gray-800 border-t-2 border-cyan-400'
                    : 'text-gray-400 hover:text-white'
                }`}
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
    </div>
  );
}
