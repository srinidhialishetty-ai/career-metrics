export default function GlassPanel({ children, className = "" }) {
  return (
    <div
      data-magnetic
      className={`motion-panel rounded-4xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-panel ${className}`}
    >
      {children}
    </div>
  );
}
