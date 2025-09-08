export default function SnappingGuides({ guides }) {
  const getGuideStyle = guide => {
    switch (guide.type) {
      case 'static-center':
        return 'bg-cyan-500 opacity-30';
      case 'static-third':
        return 'bg-purple-500 opacity-20';
      case 'active':
        return 'bg-yellow-400 opacity-80';
      case 'element':
        return 'bg-cyan-400 opacity-70';
      default:
        return 'bg-cyan-400';
    }
  };

  const getThickness = guide => {
    return guide.type === 'active' ? 2 : 1;
  };

  return guides.map((g, i) => {
    const thickness = getThickness(g);

    return g.orientation === 'vertical' ? (
      <div
        key={`${g.type}-${g.position}-${i}`}
        className={`absolute ${getGuideStyle(g)}`}
        style={{
          left: g.position - thickness / 2,
          top: 0,
          bottom: 0,
          width: thickness,
        }}
      />
    ) : (
      <div
        key={`${g.type}-${g.position}-${i}`}
        className={`absolute ${getGuideStyle(g)}`}
        style={{
          top: g.position - thickness / 2,
          left: 0,
          right: 0,
          height: thickness,
        }}
      />
    );
  });
}
