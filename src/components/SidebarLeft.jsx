import React, { useState, Fragment, useEffect } from "react";
import { iconComponentMap } from "../utils/iconMap.jsx";
import { icons } from "../utils/icons";

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
  const fontOptions = [
    "Arial", "Helvetica", "Verdana", "Tahoma",
    "Trebuchet MS", "Impact", "Georgia", "Times New Roman",
    "Courier New", "Lucida Console", "Lucida Sans Unicode",
    "Arial Black", "Franklin Gothic Medium", "Gill Sans",
    "Comic Sans MS", "Copperplate", "Papyrus",
    "Monaco", "Consolas", "OCR A Std", "OCR B",
    "Digital-7", "DS-Digital", "Press Start 2P", "Share Tech Mono",
  ];

  // No need for iconOptions as we'll map directly from iconComponentMap

  // Local state for the input value to handle typing
  const [fontSizeInput, setFontSizeInput] = useState(fontSize.toString());

  // Update local input when fontSize prop changes
  React.useEffect(() => {
    setFontSizeInput(fontSize.toString());
  }, [fontSize]);

  // Helper function to find a free space for new elements
  const findFreeSpace = (width, height) => {
    const gridSize = 20; // Grid size for positioning
    const maxAttempts = 100; // Prevent infinite loop

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Try different positions in a grid pattern
      const x = (attempt % 5) * gridSize + 50;
      const y = Math.floor(attempt / 5) * gridSize + 50;

      // Check if this position would cause a collision
      const wouldCollide = elements.some(el => {
        return !(x + width < el.x ||
                x > el.x + el.width ||
                y + height < el.y ||
                y > el.y + el.height);
      });

      if (!wouldCollide) {
        return { x, y };
      }
    }

    // If no free space found, return a fallback position
    return { x: 100, y: 100 };
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
    const defaultKey = "twitch"; // or any key from iconComponentMap
    
    const newElement = {
      id: Date.now(),
      type: "icon",
      content: defaultKey,
      iconKey: defaultKey,
      x: position.x,
      y: position.y,
      width: elementSize.width,
      height: elementSize.height,
      fontFamily: "Arial",
      fontSize: 28,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const selectedEl = elements.find(el => el.id === selectedElement);
  const selectedIcon = selectedEl && selectedEl.type === "icon" ? selectedEl : null;
  const selectedText = selectedEl && selectedEl.type === "text" ? selectedEl : null;

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
    // Ensure the size is within reasonable bounds
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

  const incrementFontSize = () => {
    updateFontSize(fontSize + 1);
  };

  const decrementFontSize = () => {
    updateFontSize(fontSize - 1);
  };

  const handleFontSizeInputChange = (e) => {
    // Update the input value as user types
    setFontSizeInput(e.target.value);
  };

  const handleFontSizeInputBlur = (e) => {
    // Only update the actual font size when user finishes typing
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      updateFontSize(value);
    } else {
      // If invalid input, revert to current fontSize
      setFontSizeInput(fontSize.toString());
    }
  };

  const handleFontSizeInputKeyPress = (e) => {
    // Update on Enter key as well
    if (e.key === 'Enter') {
      const value = parseInt(e.target.value);
      if (!isNaN(value)) {
        updateFontSize(value);
      }
      e.target.blur(); // Remove focus after pressing Enter
    }
  };

    // Icon symbols state for SVG export
  const [iconSymbols, setIconSymbols] = useState('');

  // Load icon paths when component mounts
  useEffect(() => {
    const extractSvgContent = async (svgUrl) => {
      try {
        const response = await fetch(svgUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');

        // Try to find SVG content
        const pathElement = doc.querySelector('path');
        if (pathElement?.getAttribute('d')) {
          return pathElement.getAttribute('d');
        }

        // If no path, try to get the entire SVG content
        const svgElement = doc.querySelector('svg');
        return svgElement?.innerHTML || null;
      } catch (error) {
        console.error('Error extracting SVG content:', error);
        return null;
      }
    };

    const loadIconPaths = async () => {
      try {
        console.log('Starting to load icon paths...'); // Debug log
        const symbolPromises = Object.entries(icons).map(async ([key, src]) => {
          try {
            console.log(`Processing icon: ${key}`); // Debug log
            const svgContent = await extractSvgContent(src);
            
            if (!svgContent) {
              console.warn(`No SVG content found for icon: ${key}`);
              return '';
            }

            // Create symbol with the entire SVG content
            const symbol = `
              <symbol id="icon-${key}" viewBox="0 0 24 24">
                ${svgContent.includes('<path') ? svgContent : `<path d="${svgContent}"/>`}
              </symbol>
            `;
            console.log(`Created symbol for ${key}`); // Debug log
            return symbol;
          } catch (error) {
            console.error(`Error processing icon ${key}:`, error);
            return '';
          }
        });

        const symbols = (await Promise.all(symbolPromises)).filter(Boolean).join('\n');

        if (!symbols) {
          console.warn('No symbols were created');
          return;
        }

        console.log('Setting icon symbols...'); // Debug log
        setIconSymbols(symbols);
      } catch (error) {
        console.error('Error loading icon paths:', error);
      }
    };

    loadIconPaths();
  }, []);

  // --- Export SVG Function ---
  const exportAsSVG = () => {
    // Ensure 2:1 ratio dimensions (width is twice the height)
    const panelWidth = 800;
    const panelHeight = 400;

    // Create SVG with proper dimensions and viewBox
    const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        width="${panelWidth}" 
        height="${panelHeight}" 
        viewBox="0 0 ${panelWidth} ${panelHeight}"
        preserveAspectRatio="xMidYMid meet"
        style="overflow: visible;"
      >`;
    const svgFooter = `</svg>`;

    // Background rectangle with proper dimensions and rounded corners
    const rect = `
      <rect
        x="0"
        y="0"
        width="${panelWidth}"
        height="${panelHeight}"
        fill="black"
        rx="${roundedEdges ? 20 : 0}"
        ry="${roundedEdges ? 20 : 0}"
      />`;

    const defs = `
      <defs>
        ${iconSymbols}
      </defs>
    `;

    // Enhanced glow filter with more intense effects
    const glowFilter = `
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feFlood flood-color="${glowColor}" flood-opacity="0.8" result="colorAlpha"/>
          <feComposite in="colorAlpha" in2="coloredBlur" operator="in" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="iconGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feFlood flood-color="${glowColor}" flood-opacity="1"/>
          <feComposite in2="blur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    `;

    // Create a map of icon content for direct embedding
    const iconContentMap = {};
    const parser = new DOMParser();

    // Extract SVG content for each icon that's being used
    elements.forEach(el => {
      if (el.type === "icon" && el.content && !iconContentMap[el.content]) {
        const symbolMatch = iconSymbols.match(new RegExp(`<symbol id="icon-${el.content}"[^>]*>(.*?)</symbol>`, 's'));
        if (symbolMatch) {
          iconContentMap[el.content] = symbolMatch[1].trim();
        }
      }
    });

    const svgContent = elements.map(el => {
      if (el.type === "text") {
        const fontWeight = el.fontWeight || "normal";
        const fontStyle = el.fontStyle || "normal";
        const textAnchor = el.textAlign === "left" ? "start" : 
                          el.textAlign === "right" ? "end" : "middle";
        
        // Create a container group for the text with exact positioning
        return `
          <g transform="translate(${el.x},${el.y})">
            <text
              x="${el.textAlign === "left" ? 0 : 
                 el.textAlign === "right" ? el.width : 
                 el.width / 2}"
              y="${el.height / 2}"
              font-family="${el.fontFamily}"
              font-size="${el.fontSize}"
              font-weight="${fontWeight}"
              font-style="${fontStyle}"
              text-anchor="${textAnchor}"
              dominant-baseline="middle"
              fill="${glowColor}"
              style="filter: url(#glow)"
            >${el.content}</text>
          </g>`;
      } else if (el.type === "icon" && el.content && iconContentMap[el.content]) {
        // Directly embed the icon SVG content with proper scaling
        const scale = Math.min(el.width / 24, el.height / 24); // Assuming original viewBox is 24x24
        return `
          <g transform="translate(${el.x},${el.y})">
            <g transform="scale(${scale})" fill="${glowColor}" style="filter: url(#iconGlow)">
              ${iconContentMap[el.content]}
            </g>
          </g>`;
      }
      return "";
    }).join("\n");

    // Enhanced glow filters for both text and icons
    const filters = `
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feFlood flood-color="${glowColor}" flood-opacity="0.8" result="colorAlpha"/>
          <feComposite in="colorAlpha" in2="coloredBlur" operator="in" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="iconGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feFlood flood-color="${glowColor}" flood-opacity="1"/>
          <feComposite in2="blur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    `;

    // Debug output
    console.log('Exporting SVG with icons:', {
      hasSymbols: Boolean(iconSymbols),
      symbolsContent: iconSymbols,
      elementsWithIcons: elements.filter(el => el.type === 'icon').map(el => el.content)
    });

    // Combine all SVG parts with improved structure for maximum compatibility
    const svgString = `${svgHeader}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feFlood flood-color="${glowColor}" flood-opacity="0.8" result="colorAlpha"/>
          <feComposite in="colorAlpha" in2="coloredBlur" operator="in" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="iconGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feFlood flood-color="${glowColor}" flood-opacity="1"/>
          <feComposite in2="blur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      ${rect}
      ${svgContent}
      ${svgFooter}`;

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "panel-export.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col gap-4 p-6 shadow-xl overflow-y-auto">
      <h2 className="text-lg font-semibold tracking-wide text-blue-400">
        Design Tools
      </h2>

      <button onClick={addText} className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition shadow">
        ➕ Add Text
      </button>
      <button onClick={addIcon} className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition shadow">
        ⭐ Add Icon
      </button>

      {/* Icon Controls */}
      {selectedIcon && (
        <>
          <div className="mt-4 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-blue-400">Icon Controls</h3>
            <button
              onClick={() => {
                const updatedElements = elements.filter(el => el.id !== selectedElement);
                setElements(updatedElements);
                setSelectedElement(null);
              }}
              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
              title="Delete Icon"
            >
              Delete
            </button>
          </div>
          
          <div className="mt-4 space-y-6">
            <h4 className="text-sm font-semibold text-blue-400">Available Icons</h4>
            
            {/* Stream Icons */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-400 border-b border-gray-700 pb-1">
                🎥 Streaming Icons
              </h5>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(iconComponentMap)
                  .filter(([name]) => name.includes('twitch') || name.includes('youtube') || name.includes('stream'))
                  .map(([iconName, Icon]) => (
                    <button
                      key={iconName}
                      onClick={() => updateIconContent(iconName)}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded transition"
                      style={{
                        backgroundColor: selectedIcon.content === iconName ? glowColor : "transparent",
                        boxShadow: selectedIcon.content === iconName ? `0 0 10px ${glowColor}` : 'none'
                      }}
                      title={`Select ${iconName}`}
                    >
                      {Icon ? <Icon /> : "?"}
                    </button>
                  ))}
              </div>
            </div>

            {/* Gaming Icons */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-400 border-b border-gray-700 pb-1">
                🎮 Gaming Icons
              </h5>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(iconComponentMap)
                  .filter(([name]) => name.includes('game') || name.includes('controller') || name.includes('play'))
                  .map(([iconName, Icon]) => (
                    <button
                      key={iconName}
                      onClick={() => updateIconContent(iconName)}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded transition"
                      style={{
                        backgroundColor: selectedIcon.content === iconName ? glowColor : "transparent",
                        boxShadow: selectedIcon.content === iconName ? `0 0 10px ${glowColor}` : 'none'
                      }}
                      title={`Select ${iconName}`}
                    >
                      {Icon ? <Icon /> : "?"}
                    </button>
                  ))}
              </div>
            </div>

            {/* Sports Icons */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-400 border-b border-gray-700 pb-1">
                ⚽ Sports Icons
              </h5>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(iconComponentMap)
                  .filter(([name]) => name.includes('sport') || name.includes('ball') || name.includes('game'))
                  .map(([iconName, Icon]) => (
                    <button
                      key={iconName}
                      onClick={() => updateIconContent(iconName)}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded transition"
                      style={{
                        backgroundColor: selectedIcon.content === iconName ? glowColor : "transparent",
                        boxShadow: selectedIcon.content === iconName ? `0 0 10px ${glowColor}` : 'none'
                      }}
                      title={`Select ${iconName}`}
                    >
                      {Icon ? <Icon /> : "?"}
                    </button>
                  ))}
              </div>
            </div>

            {/* Other Icons */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-400 border-b border-gray-700 pb-1">
                ✨ Other Icons
              </h5>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(iconComponentMap)
                  .filter(([name]) => 
                    !name.includes('twitch') && 
                    !name.includes('youtube') && 
                    !name.includes('stream') &&
                    !name.includes('game') && 
                    !name.includes('controller') &&
                    !name.includes('play') &&
                    !name.includes('sport') && 
                    !name.includes('ball')
                  )
                  .map(([iconName, Icon]) => (
                    <button
                      key={iconName}
                      onClick={() => updateIconContent(iconName)}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded transition"
                      style={{
                        backgroundColor: selectedIcon.content === iconName ? glowColor : "transparent",
                        boxShadow: selectedIcon.content === iconName ? `0 0 10px ${glowColor}` : 'none'
                      }}
                      title={`Select ${iconName}`}
                    >
                      {Icon ? <Icon /> : "?"}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Text Formatting Controls */}
      {selectedText && (
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold text-blue-400">Text Settings</h3>
          
          {/* Text Formatting Buttons */}
          <div className="flex gap-2">
            <button
              onClick={toggleBold}
              className={`flex-1 px-2 py-1 rounded ${selectedText.fontWeight === "bold" ? "bg-cyan-600" : "bg-gray-700 hover:bg-gray-600"} transition`}
              title="Bold"
            >
              <span className={`font-bold ${selectedText.fontWeight === "bold" ? "text-white" : "text-gray-300"}`}>B</span>
            </button>
            
            <button
              onClick={toggleItalic}
              className={`flex-1 px-2 py-1 rounded ${selectedText.fontStyle === "italic" ? "bg-cyan-600" : "bg-gray-700 hover:bg-gray-600"} transition`}
              title="Italic"
            >
              <span className={`italic ${selectedText.fontStyle === "italic" ? "text-white" : "text-gray-300"}`}>I</span>
            </button>
          </div>

          {/* Text Alignment Buttons */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Text Alignment</label>
            <div className="flex gap-1">
              {["left", "center", "right"].map((alignment) => (
                <button
                  key={alignment}
                  onClick={() => setTextAlignment(alignment)}
                  className={`flex-1 px-2 py-1 rounded ${selectedText.textAlign === alignment ? "bg-cyan-600" : "bg-gray-700 hover:bg-gray-600"} transition`}
                  title={`Align ${alignment}`}
                >
                  <span className="text-white text-sm">
                    {alignment === "left" ? "◀" : alignment === "center" ? "●" : "▶"}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => updateFontFamily(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Font Size</label>
            <div className="flex items-center gap-2">
              <button
                onClick={decrementFontSize}
                disabled={fontSize <= 8}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <input
                type="text"
                value={fontSizeInput}
                onChange={handleFontSizeInputChange}
                onBlur={handleFontSizeInputBlur}
                onKeyPress={handleFontSizeInputKeyPress}
                className="w-16 p-1 text-center bg-gray-800 border border-gray-700 rounded text-white"
              />
              <button
                onClick={incrementFontSize}
                disabled={fontSize >= 200}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <div className="text-xs text-gray-400 text-center mt-1">{fontSize}px</div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={roundedEdges}
            onChange={(e) => setRoundedEdges(e.target.checked)}
          />
          Rounded Corners
        </label>
      </div>

      <div className="mt-6">
        <button
          onClick={exportAsSVG}
          className="px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition shadow"
        >
          ⬇️ Export as SVG
        </button>
      </div>
    </aside>
  );
}