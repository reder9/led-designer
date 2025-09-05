import { useState, useEffect, useRef } from "react";
import Panel from "./components/Panel";
import SidebarLeft from "./components/SidebarLeft";
import SidebarRight from "./components/SidebarRight";
import { hexToRgb } from "./utils/colors";
import "./index.css";

export default function App() {
  const width = 800;
  const height = 400;

  const [elements, setElements] = useState([]);
  const [glowColor, setGlowColor] = useState("#00faff");
  const [roundedEdges, setRoundedEdges] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(36);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [glowMode, setGlowMode] = useState("rainbow");
  const [showLedBorder, setShowLedBorder] = useState(true);
  const [speed, setSpeed] = useState(3);

  const sidebarRef = useRef(null);

  // Mirror body scroll into sidebar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        sidebarRef.current.scrollTop = window.scrollY;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Expand body height equal to sidebar’s scroll height
  useEffect(() => {
    const updateBodyHeight = () => {
      if (sidebarRef.current) {
        document.body.style.height = `${sidebarRef.current.scrollHeight}px`;
      }
    };
    updateBodyHeight();
    window.addEventListener("resize", updateBodyHeight);
    return () => window.removeEventListener("resize", updateBodyHeight);
  }, []);

  // Initialize with placeholder text
  useEffect(() => {
    const placeholderElement = {
      id: Date.now(),
      type: "text",
      content: "Customize your LED panel",
      x: width / 2 - 200,
      y: height / 2 - 30,
      width: 400,
      height: 60,
      fontFamily: "Impact",
      fontSize: 36,
    };
    setElements([placeholderElement]);
    setSelectedElement(placeholderElement.id);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden fixed inset-0">
      {/* Header */}
      <header className="w-full py-4 text-center bg-gray-900 shadow-md flex-shrink-0">
        <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">
          LED Panel Designer
        </h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-900 flex-shrink-0 overflow-hidden">
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
            glowColor={glowColor}
            showLedBorder={showLedBorder}
            setShowLedBorder={setShowLedBorder}
          />
        </div>

        {/* Center Panel */}
        <div className="flex-1 flex flex-col items-center justify-center border-x border-gray-700 overflow-hidden">
          <Panel
            elements={elements}
            setElements={setElements}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            glowColor={glowColor}
            isPowerOn={isPowerOn}
            roundedEdges={roundedEdges}
            width={width}
            height={height}
            glowMode={glowMode}
            brightness={brightness}
            speed={speed}
            showLedBorder={showLedBorder}
          />
        </div>

        {/* Right Sidebar (scroll target) */}
        <div
          ref={sidebarRef}
          className="w-80 bg-gray-800 flex-shrink-0 overflow-hidden"
        >
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

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-4 px-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-gray-400 mr-2">Created by</span>
            <span className="font-semibold text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              RederSoft / RederCraft
            </span>
          </div>

          <a
            href="https://www.etsy.com/shop/RederCraft"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
          >
            Visit Our Etsy Shop
          </a>
        </div>
      </footer>
    </div>
  );
}
