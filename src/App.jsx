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

  // Simple placeholder for saveToHistory - implement useHistory hook if needed
  const saveToHistory = () => {
    // TODO: Implement history functionality
  };

  const sidebarRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Initialize placeholder text
  useEffect(() => {
    const placeholderElement = {
      id: Date.now(),
      type: 'text',
      content: 'Customize your LED panel',
      x: baseWidth / 2 - 200,
      y: baseHeight / 2 - 30,
      width: 400,
      height: 60,
      fontFamily: 'Impact',
      fontSize: 32,
    };
    setElements([placeholderElement]);
    setSelectedElement(placeholderElement.id);
  }, []);

  return (
    <div className='h-screen flex flex-col overflow-hidden fixed inset-0'>
      {/* Main Content */}
      {isMobile ? (
        // --- MOBILE LAYOUT: Panel → Left Sidebar → Right Sidebar
        <div className='flex-1 flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 overflow-y-auto'>
          {/* Panel on top */}
          <div className='flex-1 flex items-center justify-center border-b border-gray-700 p-4'>
            <div className='w-full max-w-5xl'>
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

          {/* Left Sidebar (middle) */}
          <div className='bg-gray-900 border-b border-gray-700 p-4'>
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
              setIsPowerOn={setIsPowerOn}
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

          {/* Right Sidebar (bottom remote) */}
          <div className='bg-gray-800 p-4'>
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
              setIsPowerOn={setIsPowerOn}
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
