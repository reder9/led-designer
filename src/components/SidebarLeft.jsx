import React, { useState, useEffect } from "react";
import { iconComponentMap } from "../utils/iconMap.jsx";
import { icons } from "../utils/icons";
import { exportAsImage } from "../utils/exportImage";
import { exportLightBurnSVG } from "../utils/exportLightBurnSVG";
import IconControls from "./sidebar/IconControls";
import TextControls from "./sidebar/TextControls";
import "../styles/fonts.css";
import "../styles/icons.css";

export default function SidebarLeft({
  elements,
  setElements,
  selectedElement,
  setSelectedElement,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  roundedEdges,
  setRoundedEdges,
  glowColor,
  width = 800,
  height = 400,
}) {
  const [fontSizeInput, setFontSizeInput] = useState(fontSize.toString());
  const [activeIconCategory, setActiveIconCategory] = useState("Streaming");
  const [iconSymbols, setIconSymbols] = useState('');

  const fontOptions = [
    // Modern Gaming/Streaming Fonts
    { name: "Orbitron", style: "font-orbitron", category: "Gaming" },
    { name: "Russo One", style: "font-russo-one", category: "Gaming" },
    { name: "Play", style: "font-play", category: "Gaming" },
    { name: "Rajdhani", style: "font-rajdhani", category: "Gaming" },
    { name: "Chakra Petch", style: "font-chakra", category: "Gaming" },
    { name: "Audiowide", style: "font-audiowide", category: "Gaming" },
    { name: "Teko", style: "font-teko", category: "Gaming" },
    { name: "Aldrich", style: "font-aldrich", category: "Gaming" },
    { name: "Quantico", style: "font-quantico", category: "Gaming" },
    { name: "Oxanium", style: "font-oxanium", category: "Gaming" },
    
    // Retro/Pixel Fonts
    { name: "Press Start 2P", style: "font-press-start", category: "Retro" },
    { name: "VT323", style: "font-vt323", category: "Retro" },
    { name: "Share Tech Mono", style: "font-share-tech", category: "Retro" },
    
    // Futuristic/Tech Fonts
    { name: "Iceland", style: "font-iceland", category: "Tech" },
    { name: "Syncopate", style: "font-syncopate", category: "Tech" },
    { name: "Wallpoet", style: "font-wallpoet", category: "Tech" },
    { name: "Nova Square", style: "font-nova-square", category: "Tech" },
    { name: "Michroma", style: "font-michroma", category: "Tech" },
    
    // Decorative Fonts
    { name: "Stalinist One", style: "font-stalinist", category: "Decorative" },
    { name: "Rubik Mono One", style: "font-rubik-mono", category: "Decorative" },
    { name: "Faster One", style: "font-faster-one", category: "Decorative" },
    { name: "Monoton", style: "font-monoton", category: "Decorative" },
    
    // System Fonts
    { name: "Arial", style: "", category: "System" },
    { name: "Impact", style: "", category: "System" },
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
    const padding = 10; // Keep elements away from edges

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = (attempt % 10) * gridSize + padding;
      const y = Math.floor(attempt / 10) * gridSize + padding;

      // Check if element would fit within panel bounds
      if (x + elementWidth > panelWidth - padding || y + elementHeight > panelHeight - padding) {
        continue;
      }

      // Check for collisions with existing elements
      const wouldCollide = elements.some(el => {
        return !(x + elementWidth <= el.x ||
                x >= el.x + el.width ||
                y + elementHeight <= el.y ||
                y >= el.y + el.height);
      });

      if (!wouldCollide) {
        return { x, y };
      }
    }

    // Fallback: find any available space near top-left
    for (let y = padding; y < panelHeight - elementHeight - padding; y += gridSize) {
      for (let x = padding; x < panelWidth - elementWidth - padding; x += gridSize) {
        const wouldCollide = elements.some(el => {
          return !(x + elementWidth <= el.x ||
                  x >= el.x + el.width ||
                  y + elementHeight <= el.y ||
                  y >= el.y + el.height);
        });

        if (!wouldCollide) {
          return { x, y };
        }
      }
    }

    // Last resort: place at top-left with padding
    return { x: padding, y: padding };
  };

  const addText = () => {
    const elementSize = { width: 120, height: 40 };
    const position = findFreeSpace(elementSize.width, elementSize.height);
    
    const newElement = {
      id: Date.now(),
      type: "text",
      content: "Edit me",
      x: position.x,
      y: position.y,
      width: elementSize.width,
      height: elementSize.height,
      fontFamily,
      fontSize,
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "center",
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const addIcon = () => {
    const elementSize = { width: 60, height: 60 };
    const position = findFreeSpace(elementSize.width, elementSize.height);
    const defaultKey = "twitch";
    
    const newElement = {
      id: Date.now(),
      type: "icon",
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
  const selectedIcon = selectedEl?.type === "icon" ? selectedEl : null;
  const selectedText = selectedEl?.type === "text" ? selectedEl : null;

  const updateIconContent = (iconName) => {
    if (selectedElement) {
      setElements(elements.map(el =>
        el.id === selectedElement && el.type === "icon"
          ? { ...el, content: iconName, iconKey: iconName }
          : el
      ));
    }
  };

  const updateFontFamily = (family) => {
    setFontFamily(family);
    if (selectedElement) {
      setElements(elements.map(el => 
        el.id === selectedElement ? { ...el, fontFamily: family } : el
      ));
    }
  };

  const updateFontSize = (size) => {
    const newSize = Math.max(8, Math.min(200, size));
    setFontSize(newSize);
    if (selectedElement) {
      setElements(elements.map(el => 
        el.id === selectedElement ? { ...el, fontSize: newSize } : el
      ));
    }
  };

  const updateTextFormat = (property, value) => {
    if (selectedElement && selectedText) {
      setElements(elements.map(el => 
        el.id === selectedElement ? { ...el, [property]: value } : el
      ));
    }
  };

  const toggleBold = () => {
    if (selectedText) {
      updateTextFormat("fontWeight", selectedText.fontWeight === "bold" ? "normal" : "bold");
    }
  };

  const toggleItalic = () => {
    if (selectedText) {
      updateTextFormat("fontStyle", selectedText.fontStyle === "italic" ? "normal" : "italic");
    }
  };

  const setTextAlignment = (alignment) => {
    updateTextFormat("textAlign", alignment);
  };

  const handleFontSizeInputChange = (e) => {
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

  const handleFontSizeInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFontSizeInputBlur();
    }
  };

  // Load icon paths when component mounts
  useEffect(() => {
    const extractSvgContent = async (svgUrl) => {
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
            console.error(`Error processing icon ${key}:`, error);
            return '';
          }
        });

        const symbols = (await Promise.all(symbolPromises)).filter(Boolean).join('\n');
        if (symbols) {
          setIconSymbols(symbols);
        }
      } catch (error) {
        console.error('Error loading icon paths:', error);
      }
    };

    loadIconPaths();
  }, []);

  const handleExport = async () => {
    try {
      // Get the inner panel element (without outer glow effects)
      const panel = document.getElementById('panel-inner');
      if (!panel) {
        throw new Error('Panel inner element not found');
      }

      // Create a style element to override all colors during export
      const exportStyle = document.createElement('style');
      exportStyle.id = 'export-override-styles';
      exportStyle.innerHTML = `
        /* Override all text elements */
        #panel-inner textarea {
          color: #00FFFF !important;
          text-shadow: none !important;
          filter: none !important;
          background-color: transparent !important;
        }
        
        /* Override all icon containers and SVG elements */
        #panel-inner div[style*="backgroundColor"] {
          background-color: transparent !important;
          filter: none !important;
        }
        
        #panel-inner svg,
        #panel-inner svg *,
        #panel-inner path {
          color: #00FFFF !important;
          fill: #00FFFF !important;
          stroke: none !important;
          filter: none !important;
        }
        
        /* Force icon divs to show cyan content */
        #panel-inner .element-wrapper > div {
          background-color: transparent !important;
          filter: none !important;
        }
        
        #panel-inner .element-wrapper > div svg,
        #panel-inner .element-wrapper > div svg * {
          color: #00FFFF !important;
          fill: #00FFFF !important;
          filter: none !important;
        }
        
        /* Ensure the panel itself stays black */
        #panel-inner {
          background-color: black !important;
          border: 2px solid rgba(255,255,255,0.3) !important;
        }
        
        /* Hide UI elements */
        .react-resizable-handle,
        .resize-handle,
        [style*="dashed"] {
          display: none !important;
        }
      `;
      
      // Add the style to the document
      document.head.appendChild(exportStyle);

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 200));

      // Export as PNG for better compatibility (targeting inner panel only)
      await exportAsImage('png', 'panel-inner');

      // Remove the export styles
      document.head.removeChild(exportStyle);

    } catch (error) {
      console.error('Failed to export:', error);
      // Make sure to clean up styles even if export fails
      const exportStyle = document.getElementById('export-override-styles');
      if (exportStyle) {
        document.head.removeChild(exportStyle);
      }
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 p-6 shadow-xl overflow-y-auto">
      <div className="flex flex-col gap-4">
        {/* Header and Add Buttons */}
        <div>
          <h2 className="text-lg font-semibold tracking-wide text-blue-400 mb-4">
            Design Tools
          </h2>

          <div className="flex gap-2">
            <button onClick={addText} className="flex-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition shadow">
              ➕ Add Text
            </button>
            <button onClick={addIcon} className="flex-1 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition shadow">
              ⭐ Add Icon
            </button>
          </div>
        </div>

        {/* Selected Element Controls */}
        {selectedIcon && (
          <IconControls 
            selectedIcon={selectedIcon}
            selectedElement={selectedElement}
            setElements={setElements}
            setSelectedElement={setSelectedElement}
            updateIconContent={updateIconContent}
            elements={elements}
          />
        )}

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
          />
        )}

        {/* Global Settings */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={roundedEdges}
              onChange={(e) => setRoundedEdges(e.target.checked)}
              className="form-checkbox bg-gray-700 border-gray-600 text-blue-500 rounded"
            />
            <span className="text-gray-300">Rounded Corners</span>
          </label>
        </div>

        {/* Export Button */}
        <div className="mt-4">
          <button
            onClick={handleExport}
            className="w-full px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition shadow text-white"
          >
            ⬇️ Export as SVG
          </button>
        </div>
      </div>
    </aside>
  );
}
