import React from "react";
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
  height = 600,
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
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const addIcon = () => {
    const newElement = {
      id: Date.now(),
      type: "icon",
      content: "twitch", // default to one of the map keys
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

  const selectedIcon = elements.find(el => el.id === selectedElement && el.type === "icon");

  const updateIconContent = (icon) => {
    if (selectedElement) {
      setElements(elements.map(el =>
        el.id === selectedElement && el.type === "icon"
          ? { ...el, content: icon.name }
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
    setFontSize(size);
    if (selectedElement) {
      setElements(elements.map(el => 
        el.id === selectedElement ? { ...el, fontSize: size } : el
      ));
    }
  };

  // --- Export SVG Function ---
  const exportAsSVG = () => {
    const panelWidth = 800;
    const panelHeight = 400;

    const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${panelWidth}" height="${panelHeight}" viewBox="0 0 ${panelWidth} ${panelHeight}">`;
    const svgFooter = `</svg>`;

    const rect = `
      <rect
        x="0" y="0"
        width="${panelWidth}" height="${panelHeight}"
        fill="black"
        rx="${roundedEdges ? 20 : 0}"
        ry="${roundedEdges ? 20 : 0}"
      />`;

    const svgContent = elements.map(el => {
      const x = el.x + el.width / 2;
      const y = el.y + el.height / 2;

      if (el.type === "text") {
        return `
          <text
            x="${x}"
            y="${y}"
            font-family="${el.fontFamily}"
            font-size="${el.fontSize}"
            text-anchor="middle"
            alignment-baseline="middle"
            fill="${glowColor}"
          >
            ${el.content}
          </text>`;
      } else if (el.type === "icon") {
        return `
          <text
            x="${x}"
            y="${y}"
            font-family="${el.fontFamily}"
            font-size="${el.fontSize}"
            text-anchor="middle"
            alignment-baseline="middle"
            fill="${glowColor}"
          >
            ${el.content}
          </text>`;
      }
      return "";
    }).join("\n");

    const svgString = `${svgHeader}\n${rect}\n${svgContent}\n${svgFooter}`;

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

      {/* Icon Picker */}
      {selectedIcon && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Icon Picker</h3>
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
      )}

      {/* Font Controls */}
      {selectedElement && (
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold text-blue-400">Text Settings</h3>
          
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
            <input
              type="range"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => updateFontSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-400 text-center">{fontSize}px</div>
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
