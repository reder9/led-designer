import React, { useEffect, useState } from "react";

export default function SidebarRight({
  glowMode,
  setGlowMode,
  glowColor,
  setGlowColor,
  isPowerOn,
  setIsPowerOn,
  brightness,
  setBrightness,
  speed,
  setSpeed,
}) {
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const colorPresets = [
    { name: "Red", value: "#FF0000" },
    { name: "Orange", value: "#FF4500" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Green", value: "#00FF00" },
    { name: "Blue", value: "#0000FF" },
    { name: "Purple", value: "#800080" },
    { name: "Pink", value: "#FF69B4" },
    { name: "Cyan", value: "#00FFFF" },
    { name: "White", value: "#FFFFFF" },
  ];

  const effects = [
    { name: "Fade", emoji: "🌅", function: "fade" },
    { name: "Flash", emoji: "⚡", function: "flash" },
    { name: "Strobe", emoji: "💫", function: "strobe" },
    { name: "Smooth", emoji: "🌊", function: "smooth" },
    { name: "Rainbow", emoji: "🌈", function: "rainbow" },
    { name: "Pulse", emoji: "💓", function: "pulse" },
  ];

  const togglePower = () => {
    setIsPowerOn(!isPowerOn);
  };

  const handleColorPreset = (color) => {
    if (isPowerOn) {
      setGlowColor(color);
      setGlowMode("solid");
    }
  };

  const handleEffect = (effectFunction) => {
    if (isPowerOn) {
      setGlowMode(effectFunction);
    }
  };

  return (
    <aside className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-full">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-6">
          {/* Disclaimer */}
          <div className="p-4 bg-gradient-to-br from-amber-900/30 to-yellow-900/20 rounded-xl border border-amber-600/30 backdrop-blur-sm">
            <div className="text-xs text-amber-200 text-center">
              <div className="flex items-center justify-center gap-2 font-semibold mb-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Notice
              </div>
              <div className="leading-relaxed">
                This remote shows possible LED effects. Your actual remote may have different functions or require app customization for similar effects.
              </div>
            </div>
          </div>

          {/* Remote Header */}
          <div className="text-center mb-4">
            <div className="relative inline-block">
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-wide">
                🎮 LED Remote Control
              </h2>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              Control your LED panel effects
            </p>
          </div>

          {/* Remote Control Panel */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-2xl border border-gray-600">
            {/* Power Button */}
            <div className="text-center mb-6">
              <button
                onClick={togglePower}
                className={`group relative w-20 h-20 rounded-full font-bold text-sm shadow-2xl transition-all duration-300 ${
                  isPowerOn
                    ? "bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white shadow-red-500/25"
                    : "bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-300 shadow-gray-500/25"
                } hover:scale-105 hover:-translate-y-1`}
              >
                <div className="absolute inset-2 rounded-full border border-white/20"></div>
                <span className="relative z-10">POWER</span>
                {isPowerOn && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/20 to-transparent"></div>
                )}
              </button>
            </div>

            {/* Color Presets */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-400 font-medium">Solid Colors</label>
                {glowMode === "solid" && (
                  <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    Active
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {colorPresets.map((color, index) => {
                  const isSelected = glowMode === "solid" && glowColor === color.value;
                  return (
                    <button
                      key={index}
                      onClick={() => handleColorPreset(color.value)}
                      className={`group relative w-14 h-14 rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
                        isSelected 
                          ? "border-cyan-400 shadow-cyan-400/50 ring-2 ring-cyan-400/30" 
                          : "border-gray-600 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent group-hover:from-white/20"></div>
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <>
                          <div className="absolute inset-0 rounded-xl bg-cyan-400/20 animate-pulse"></div>
                          <div className="absolute top-1 right-1 w-3 h-3 bg-cyan-400 rounded-full border border-white shadow-lg">
                            <div className="absolute inset-0.5 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-2 h-2 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Hover Indicator */}
                      {!isSelected && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-full h-full bg-cyan-400 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Effects */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-400 font-medium">Visual Effects</label>
                {glowMode && glowMode !== "solid" && (
                  <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    {effects.find(e => e.function === glowMode)?.name || "Active"}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {effects.map((effect, index) => {
                  const isSelected = glowMode === effect.function;
                  return (
                    <button
                      key={index}
                      onClick={() => handleEffect(effect.function)}
                      className={`group relative p-3 rounded-xl border text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
                        isSelected
                          ? "bg-gradient-to-br from-cyan-500/40 to-blue-600/40 border-cyan-400 shadow-cyan-400/50 ring-2 ring-cyan-400/30"
                          : "bg-gradient-to-br from-blue-600/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-500/30 border-blue-500/30 hover:border-blue-400/50"
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-xl transition-all duration-200 ${
                        isSelected 
                          ? "bg-gradient-to-br from-cyan-400/10 to-blue-500/10 animate-pulse" 
                          : "bg-gradient-to-br from-white/5 to-transparent group-hover:from-white/10"
                      }`}></div>
                      
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        <span className="text-lg">{effect.emoji}</span>
                        <span className="font-medium">{effect.name}</span>
                        
                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brightness */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block font-medium">Brightness</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBrightness(Math.max(0, brightness - 10))}
                  className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={brightness <= 0}
                >
                  -
                </button>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md border border-gray-600">
                    {brightness}%
                  </div>
                </div>
                <button
                  onClick={() => setBrightness(Math.min(100, brightness + 10))}
                  className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={brightness >= 100}
                >
                  +
                </button>
              </div>
            </div>

            {/* Speed Control */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block font-medium">Effect Speed</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSpeed(Math.max(1, speed - 1))}
                  className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={speed <= 1}
                >
                  -
                </button>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md border border-gray-600">
                    Level {speed}
                  </div>
                </div>
                <button
                  onClick={() => setSpeed(Math.min(5, speed + 1))}
                  className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={speed >= 5}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Panel - Pinned to Bottom */}
      <div className="border-t border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-600 shadow-lg overflow-hidden">
          {/* Header with toggle button */}
          <button
            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors duration-200"
          >
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPowerOn ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              Remote Status
            </h3>
            <svg 
              className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isStatsExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Expandable content */}
          <div className={`transition-all duration-300 ease-in-out ${isStatsExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4 space-y-2 text-sm border-t border-gray-700/50">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">Power:</span>
                <span className={`font-medium ${isPowerOn ? 'text-green-400' : 'text-red-400'}`}>
                  {isPowerOn ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">Brightness:</span>
                <span className="text-yellow-400 font-medium">{brightness}%</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">Speed:</span>
                <span className="text-cyan-400 font-medium">Level {speed}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">Mode:</span>
                <span className="text-blue-400 font-medium capitalize">{glowMode || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
