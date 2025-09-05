import React, { useState, Fragment } from "react";
import { iconComponentMap } from "../utils/iconMap";

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

  // Build iconOptions from map instead of hardcoding JSX
  const iconOptions = Object.keys(iconComponentMap).map((key) => ({
    name: key,
    Icon: iconComponentMap[key],
  }));

  // Local state for the input value to handle typing
  const [fontSizeInput, setFontSizeInput] = useState(fontSize.toString());

  // Update local input when fontSize prop changes
  React.useEffect(() => {
    setFontSizeInput(fontSize.toString());
  }, [fontSize]);

  const addText = () => {
    const newElement = {
      id: Date.now(),
      type: "text",
      content: "Edit me",
      x: 100,
      y: 100,
      width: 120,
      height: 40,
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
    const defaultKey = "twitch"; // or any key from iconComponentMap
    const newElement = {
      id: Date.now(),
      type: "icon",
      content: defaultKey,
      iconKey: defaultKey,
      x: 150,
      y: 150,
      width: 60,
      height: 60,
      fontFamily: "Arial",
      fontSize: 28,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const selectedEl = elements.find(el => el.id === selectedElement);
  const selectedIcon = selectedEl && selectedEl.type === "icon" ? selectedEl : null;
  const selectedText = selectedEl && selectedEl.type === "text" ? selectedEl : null;

  const updateIconContent = (icon) => {
    if (selectedElement) {
      setElements(elements.map(el =>
        el.id === selectedElement && el.type === "icon"
          ? { ...el, content: icon.name, iconKey: icon.name }
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

    // Add defs section for icon paths
    const iconSymbols = Object.entries(iconComponentMap).map(([key, Icon]) => {
      return `
        <symbol id="icon-${key}" viewBox="0 0 24 24">
          <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
        </symbol>
      `;
    });

    const defs = `
      <defs>
        ${iconSymbols.join('\n')}
      </defs>
    `;

    const svgContent = elements.map(el => {
      if (el.type === "text") {
        const fontWeight = el.fontWeight || "normal";
        const fontStyle = el.fontStyle || "normal";
        const textAnchor = el.textAlign === "left" ? "start" : 
                          el.textAlign === "right" ? "end" : "middle";
        
        // Calculate exact x position based on alignment
        let x;
        if (el.textAlign === "left") {
          x = el.x;
        } else if (el.textAlign === "right") {
          // For right-aligned text, we need to account for the actual text width
          x = Math.min(el.x + el.width, panelWidth - 2); // Keep 2px margin from edge
        } else {
          x = el.x + (el.width / 2);
        }
        
        // Calculate exact y position (vertical center)
        const y = el.y + (el.height / 2);
        
        return `
          <text
            x="${x}"
            y="${y}"
            font-family="${el.fontFamily}"
            font-size="${el.fontSize}"
            font-weight="${fontWeight}"
            font-style="${fontStyle}"
            text-anchor="${textAnchor}"
            dominant-baseline="middle"
            fill="${glowColor}"
            style="filter: url(#glow)"
          >
            ${el.content}
          </text>`;
      } else if (el.type === "icon" && el.content) {
        // Use a simple SVG shape for icons in the export
        return `
          <g transform="translate(${el.x},${el.y})">
            <rect
              width="${el.width}"
              height="${el.height}"
              fill="none"
            />
            <use
              href="#icon-${el.content}"
              width="${el.width}"
              height="${el.height}"
              fill="${glowColor}"
              style="filter: url(#glow)"
            />
          </g>`;
      }
      return "";
    }).join("\n");

    // Enhanced glow filter
    const glowFilter = `
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feFlood flood-color="${glowColor}" flood-opacity="0.5" result="glowColor"/>
          <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow"/>
          <feMerge>
            <feMergeNode in="softGlow"/>
            <feMergeNode in="softGlow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    `;

    const svgString = `${svgHeader}\n${glowFilter}\n${defs}\n${rect}\n${svgContent}\n${svgFooter}`;

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
          
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Icon Style</h4>
            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-800 rounded">
              {iconOptions.map((icon, index) => {
                const { Icon } = icon;
                return (
                  <button
                    key={index}
                    onClick={() => updateIconContent(icon)}
                    className="w-8 h-8 flex items-center justify-center text-white text-lg hover:bg-gray-700 rounded transition"
                    style={{
                      textShadow: `0 0 5px ${glowColor}`,
                      backgroundColor: selectedIcon.content === icon.name ? glowColor : "transparent",
                    }}
                    title={`Select ${icon.name}`}
                  >
                    {Icon ? <Icon /> : "?"}
                  </button>
                );
              })}
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