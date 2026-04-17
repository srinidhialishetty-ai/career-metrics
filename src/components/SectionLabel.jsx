export default function SectionLabel({ children }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan/80">
      {children}
    </span>
  );
}
