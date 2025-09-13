import React from 'react';
import { iconsByCategory } from '../../utils/icons';

function IconControls({
  _elements,
  _setElements,
  _activeIconCategory,
  _setActiveIconCategory,
  _selectedElement,
  _selectedElement2,
  _saveToHistory,
}) {
  const categories = [
    { name: 'Social', emoji: '📱', key: 'social' },
    { name: 'Gaming', emoji: '🎮', key: 'gaming' },
    { name: 'Sports', emoji: '⚽', key: 'sports' },
  ];

  const updateIconContent = iconName => {
    // TODO: Implement icon update functionality
    console.warn('updateIconContent not implemented:', iconName);
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-sm font-semibold text-blue-400'>Icon Library</h3>
      </div>

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
                    onClick={() => updateIconContent(iconName)}
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
                      {iconName.split('-').pop()}
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
