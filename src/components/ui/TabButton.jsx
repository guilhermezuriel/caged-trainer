export function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
        active
          ? "bg-amber-500 text-stone-950 font-medium"
          : "text-stone-300 hover:text-white"
      }`}
    >
      {icon} {children}
    </button>
  );
}
