export function SegmentButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 transition-colors ${
        active
          ? "bg-amber-500 text-stone-950 font-medium"
          : "text-stone-300 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
