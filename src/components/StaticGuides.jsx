export default function StaticGuides({ width, height, showGuides }) {
  if (!showGuides) return null;

  // Calculate guide positions - only halves and thirds
  const verticalGuides = [
    width / 3, // Third
    width / 2, // Half/Center
    (2 * width) / 3, // Two thirds
  ];

  const horizontalGuides = [
    height / 3, // Third
    height / 2, // Half/Center
    (2 * height) / 3, // Two thirds
  ];

  return (
    <>
      {/* Vertical guides */}
      {verticalGuides.map((position, i) => (
        <div
          key={`v-${i}`}
          className='absolute bg-cyan-300 opacity-20'
          style={{
            left: position,
            top: 0,
            bottom: 0,
            width: 1,
            pointerEvents: 'none',
            zIndex: 500,
          }}
        />
      ))}

      {/* Horizontal guides */}
      {horizontalGuides.map((position, i) => (
        <div
          key={`h-${i}`}
          className='absolute bg-cyan-300 opacity-20'
          style={{
            top: position,
            left: 0,
            right: 0,
            height: 1,
            pointerEvents: 'none',
            zIndex: 500,
          }}
        />
      ))}
    </>
  );
}
