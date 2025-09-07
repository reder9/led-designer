export default function SnappingGuides({ guides }) {
  return guides.map((g, i) =>
    g.orientation === 'vertical' ? (
      <div
        key={i}
        className='absolute bg-cyan-400'
        style={{ left: g.position, top: 0, bottom: 0, width: 1 }}
      />
    ) : (
      <div
        key={i}
        className='absolute bg-cyan-400'
        style={{ top: g.position, left: 0, right: 0, height: 1 }}
      />
    )
  );
}
