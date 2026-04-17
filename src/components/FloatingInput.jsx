export default function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error = "",
  helperText = "",
  autoComplete,
}) {
  return (
    <label className="group relative block">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder=" "
        className={`motion-input peer h-16 w-full rounded-3xl border bg-white/[0.05] px-5 pt-5 text-sm text-white outline-none transition duration-300 placeholder:text-transparent focus:bg-white/[0.08] focus:shadow-[0_0_0_1px_rgba(69,208,255,0.2),0_0_30px_rgba(69,208,255,0.15)] ${
          error
            ? "border-rose-400/60 focus:border-rose-300"
            : "border-white/10 focus:border-cyan/60"
        }`}
      />
      <span className="pointer-events-none absolute left-5 top-5 origin-left text-sm text-mist transition duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-75">
        {label}
      </span>
      {!error && helperText ? (
        <span className="mt-2 block pl-2 text-xs text-mist/80">{helperText}</span>
      ) : null}
      {error ? <span className="mt-2 block pl-2 text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
