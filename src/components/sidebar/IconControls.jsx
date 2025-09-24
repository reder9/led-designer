import React from 'react';
import { iconsByCategory } from '../../utils/icons';

function IconControls({
  _elements,
  _setElements,
  _activeIconCategory,
  _setActiveIconCategory,
  updateIconContent,
  selectedElement,
  _saveToHistory,
  selectedIcon, // Add selectedIcon prop
  updateRotation, // Add rotation prop
}) {
  const categories = [
    { name: 'Social', emoji: '📱', key: 'social' },
    { name: 'Gaming', emoji: '🎮', key: 'gaming' },
    { name: 'Misc', emoji: '🎨', key: 'misc' },
    { name: 'Sports', emoji: '⚽', key: 'sports' },
  ];

  // Use the updateIconContent function passed from parent
  const handleIconClick = iconName => {
    if (updateIconContent && selectedElement) {
      updateIconContent(iconName);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-sm font-semibold text-blue-400'>Icon Library</h3>
      </div>

      {/* Rotation Controls for Icons */}
      {selectedIcon && (
        <div>
          <label className='text-sm text-gray-400 mb-2 block text-center'>Rotation</label>
          <div className='flex items-center justify-center gap-2'>
            <button
              onClick={() => updateRotation((selectedIcon.rotation || 0) - 15)}
              className='w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors'
              title='Rotate left 15°'
            >
              ↺
            </button>
            <div className='flex flex-col items-center'>
              <input
                type='range'
                min='-180'
                max='180'
                step='1'
                value={selectedIcon.rotation || 0}
                onChange={e => updateRotation(parseInt(e.target.value))}
                className='w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer'
              />
              <span className='text-xs text-gray-400 mt-1'>{selectedIcon.rotation || 0}°</span>
            </div>
            <button
              onClick={() => updateRotation((selectedIcon.rotation || 0) + 15)}
              className='w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors'
              title='Rotate right 15°'
            >
              ↻
            </button>
          </div>
          <div className='flex justify-center mt-2'>
            <button
              onClick={() => updateRotation(0)}
              className='px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors'
              title='Reset rotation'
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Vertical Category Sections */}
      <div className='max-h-[400px] overflow-y-auto custom-scrollbar pr-2'>
        <div className='space-y-4'>
          {categories.map(category => (
            <div key={category.name} className='icon-category'>
              <h5 className='text-sm font-medium text-gray-300 mb-3 flex items-center gap-2'>
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </h5>
              <div className='grid grid-cols-4 gap-2'>
                {Object.entries(iconsByCategory[category.key] || {}).map(([iconName, iconUrl]) => (
                  <button
                    key={iconName}
                    onClick={() => handleIconClick(iconName)}
                    className='p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group relative'
                    title={iconName.replace(/-/g, ' ').replace(/(^|\s)\S/g, l => l.toUpperCase())}
                  >
                    <div className='w-6 h-6 mx-auto'>
                      <img
                        src={iconUrl}
                        alt={iconName}
                        className='w-full h-full object-contain filter invert group-hover:invert-0 transition-all'
                      />
                    </div>
                    <div className='text-xs text-gray-400 mt-1 truncate text-center'>
                      {iconName}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IconControls;
