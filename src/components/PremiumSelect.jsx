export default function PremiumSelect({
  id,
  label,
  value,
  onChange,
  options,
  error = "",
}) {
  return (
    <label className="group relative block">
      <span className="mb-3 block pl-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan/70">
        {label}
      </span>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`h-16 w-full appearance-none rounded-3xl border bg-white/[0.05] px-5 pr-14 text-sm text-white outline-none transition duration-300 focus:bg-white/[0.08] focus:shadow-[0_0_0_1px_rgba(69,208,255,0.2),0_0_30px_rgba(69,208,255,0.15)] ${
            error
              ? "border-rose-400/60 focus:border-rose-300"
              : "border-white/10 focus:border-cyan/60"
          }`}
        >
          <option value="" disabled className="bg-night text-mist">
            Select an option
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-night text-white">
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-cyan/75">
          v
        </span>
      </div>
      {error ? <span className="mt-2 block pl-2 text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
