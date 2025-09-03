import { useState, useEffect } from "react";
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
  const [fontSize, setFontSize] = useState(16);
  const [isRainbowEffect, setIsRainbowEffect] = useState(false);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [activeEffect, setActiveEffect] = useState(null);

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 text-center bg-gray-900 shadow-md">
        <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">LED Panel Designer</h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
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
          className="bg-gray-900" // Left nav background
        />

        {/* Panel */}
        <main
          className="flex-1 flex items-center justify-center p-6"
          style={{ background: "linear-gradient(to bottom right, #1e293b, #0f172a)" }} // Main panel background
        >
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
          />
        </main>

        {/* Right Sidebar */}
        <SidebarRight
          glowColor={glowColor}
          setGlowColor={setGlowColor}
          isRainbowEffect={isRainbowEffect}
          setIsRainbowEffect={setIsRainbowEffect}
          activeEffect={activeEffect}
          setActiveEffect={setActiveEffect}
          isPowerOn={isPowerOn}
          setIsPowerOn={setIsPowerOn}
          brightness={brightness}
          setBrightness={setBrightness}
          className="bg-gray-800" // Right nav background
        />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-gray-400 mr-2">Created by</span>
            <span className="font-semibold text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              RederSoft / RederCraft
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-gray-400 text-sm text-center">
              Design and customize your LED panels for custom orders
            </p>
            
            <a 
              href="https://www.etsy.com/shop/RederCraft" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Visit Our Etsy Shop
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} RederSoft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}