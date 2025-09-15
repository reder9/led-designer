export default function SnappingGuides({ guides }) {
  const getGuideColor = type => {
    switch (type) {
      case 'center':
        return 'bg-yellow-400'; // Yellow for center alignment
      case 'edge':
        return 'bg-blue-400'; // Blue for edge alignment
      case 'panel-center':
        return 'bg-green-400'; // Green for panel center
      case 'panel-division':
        return 'bg-purple-400'; // Purple for panel divisions
      default:
        return 'bg-cyan-400'; // Default cyan
    }
  };

  const getOpacity = type => {
    switch (type) {
      case 'center':
        return 'opacity-90'; // Higher opacity for center guides (more prominent)
      case 'edge':
        return 'opacity-70'; // Medium opacity for edge guides
      default:
        return 'opacity-80'; // Default opacity
    }
  };

  return guides.map((g, i) =>
    g.orientation === 'vertical' ? (
      <div
        key={i}
        className={`absolute ${getGuideColor(g.type)} ${getOpacity(g.type)}`}
        style={{
          left: g.position,
          top: 0,
          bottom: 0,
          width: g.type === 'center' ? 2 : 1, // Thicker line for center guides
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      />
    ) : (
      <div
        key={i}
        className={`absolute ${getGuideColor(g.type)} ${getOpacity(g.type)}`}
        style={{
          top: g.position,
          left: 0,
          right: 0,
          height: g.type === 'center' ? 2 : 1, // Thicker line for center guides
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      />
    )
  );
}
