export default function DistanceIndicators({ indicators }) {
  return indicators.map((d, i) => (
    <div
      key={i}
      className="absolute text-xs text-cyan-400"
      style={{ left: d.x, top: d.y }}
    >
      {d.value}px
    </div>
  ));
}
