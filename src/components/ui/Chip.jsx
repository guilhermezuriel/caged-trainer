export function Chip({ active, disabled, onClick, children }) {
  const state = disabled
    ? "border-stone-800 text-stone-700 cursor-not-allowed"
    : active
      ? "bg-amber-500 border-amber-500 text-stone-950 font-medium"
      : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-600";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-2 py-2 text-sm border text-center transition-colors ${state}`}
    >
      {children}
    </button>
  );
}
