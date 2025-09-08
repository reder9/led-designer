import React from 'react';

export default function SidebarRight({
  glowColor,
  setGlowColor,
  isPowerOn,
  setIsPowerOn,
  brightness,
  setBrightness,
  glowMode,
  setGlowMode,
  speed,
  setSpeed,
  isMobile = false,
}) {
  const togglePower = () => {
    setIsPowerOn(!isPowerOn);
  };

  const handleEffectClick = effectFunction => {
    if (isPowerOn) {
      setGlowMode(effectFunction);
    }
  };

  if (isMobile) {
    return (
      <div className='w-full bg-gray-800'>
        <div className='flex gap-2 items-center justify-between p-2'>
          {/* Power Button */}
          <div className='flex items-center gap-2'>
            <button
              onClick={togglePower}
              className={`w-12 h-12 rounded-full font-bold text-xs shadow-lg transition-all duration-300 ${
                isPowerOn
                  ? 'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white'
                  : 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-300'
              }`}
            >
              {isPowerOn ? '⚡' : '⭘'}
            </button>
            <span className={`text-xs font-medium ${isPowerOn ? 'text-red-400' : 'text-gray-400'}`}>
              {isPowerOn ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Glow Mode Buttons */}
          <div className='flex gap-1 flex-1 justify-center'>
            {['rainbow', 'breathing', 'chase', 'solid'].map(mode => (
              <button
                key={mode}
                onClick={() => handleEffectClick(mode)}
                className={`px-2 py-1 text-xs rounded font-medium transition-all duration-200 ${
                  glowMode === mode
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
                disabled={!isPowerOn}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Color Picker */}
          <div className='flex gap-1'>
            {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
              .slice(0, 4)
              .map(color => (
                <button
                  key={color}
                  onClick={() => setGlowColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    glowColor === color ? 'border-white' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  disabled={!isPowerOn}
                />
              ))}
          </div>

          {/* Brightness Slider */}
          <div className='flex items-center gap-2'>
            <input
              type='range'
              min='10'
              max='100'
              value={brightness}
              onChange={e => setBrightness(parseInt(e.target.value))}
              className='w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer'
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${brightness}%, #374151 ${brightness}%, #374151 100%)`,
              }}
              disabled={!isPowerOn}
            />
            <span className='text-xs text-green-300 font-medium min-w-[2rem]'>{brightness}%</span>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout (existing full component)
  return (
    <aside className='w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-full'>
      {/* Scrollable Content Area */}
      <div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
        <div className='space-y-6'>
          {/* Disclaimer */}
          <div className='p-4 bg-gradient-to-br from-amber-900/30 to-yellow-900/20 rounded-xl border border-amber-600/30 backdrop-blur-sm'>
            <div className='text-xs text-amber-200 text-center'>
              <div className='flex items-center justify-center gap-2 font-semibold mb-2'>
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                Notice
              </div>
              <div className='leading-relaxed'>
                This remote shows possible LED effects. Your actual remote may have different
                functions or require app customization for similar effects.
              </div>
            </div>
          </div>

          {/* Remote Header */}
          <div className='text-center mb-4'>
            <div className='relative inline-block'>
              <h2 className='text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-wide'>
                🎮 LED Remote Control
              </h2>
              <div className='absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60'></div>
            </div>
            <p className='text-xs text-gray-400 mt-2 font-medium'>Control your LED panel effects</p>
          </div>

          {/* Remote Control Panel */}
          <div className='bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-2xl border border-gray-600'>
            {/* Power Button */}
            <div className='text-center mb-6'>
              <button
                onClick={togglePower}
                className={`group relative w-20 h-20 rounded-full font-bold text-sm shadow-2xl transition-all duration-300 ${
                  isPowerOn
                    ? 'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white shadow-red-500/25'
                    : 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-300 shadow-gray-500/25'
                } hover:scale-105 hover:-translate-y-1`}
              >
                {isPowerOn ? '⚡ ON' : '⭘ OFF'}
                <div
                  className={`absolute inset-0 rounded-full ${isPowerOn ? 'bg-red-400' : 'bg-gray-500'} opacity-30 group-hover:opacity-40 animate-pulse`}
                ></div>
              </button>
            </div>

            {/* Effect Buttons */}
            <div className='grid grid-cols-2 gap-3 mb-6'>
              {['rainbow', 'breathing', 'chase', 'solid'].map(mode => (
                <button
                  key={mode}
                  onClick={() => handleEffectClick(mode)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    glowMode === mode
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                  disabled={!isPowerOn}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {/* Color Palette */}
            <div className='space-y-4 mb-6'>
              <h4 className='text-sm font-semibold text-cyan-400'>Color</h4>
              <div className='grid grid-cols-4 gap-2'>
                {[
                  '#ff0000',
                  '#ff4500',
                  '#ffa500',
                  '#ffff00',
                  '#9acd32',
                  '#00ff00',
                  '#00ffff',
                  '#0000ff',
                  '#8a2be2',
                  '#ff00ff',
                  '#ff1493',
                  '#ffffff',
                ].map(color => (
                  <button
                    key={color}
                    onClick={() => setGlowColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      glowColor === color ? 'border-white' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={!isPowerOn}
                  />
                ))}
              </div>
            </div>

            {/* Brightness Control */}
            <div className='space-y-3 mb-6'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-semibold text-green-400'>Brightness</h4>
                <span className='text-xs text-green-300 font-medium'>{brightness}%</span>
              </div>
              <input
                type='range'
                min='10'
                max='100'
                value={brightness}
                onChange={e => setBrightness(parseInt(e.target.value))}
                className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer transition-all duration-200'
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${brightness}%, #374151 ${brightness}%, #374151 100%)`,
                }}
                disabled={!isPowerOn}
              />
              <div className='flex justify-between text-xs text-gray-500'>
                <span>Dim</span>
                <span>Bright</span>
              </div>
            </div>

            {/* Speed Control */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-semibold text-purple-400'>Speed</h4>
                <span className='text-xs text-purple-300 font-medium'>{speed}x</span>
              </div>
              <input
                type='range'
                min='1'
                max='10'
                value={speed}
                onChange={e => setSpeed(parseInt(e.target.value))}
                className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer transition-all duration-200'
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((speed - 1) / 9) * 100}%, #374151 ${((speed - 1) / 9) * 100}%, #374151 100%)`,
                }}
                disabled={!isPowerOn}
              />
              <div className='flex justify-between text-xs text-gray-500'>
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
