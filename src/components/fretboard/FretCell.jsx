export function FretCell({
  isOpen,
  thick,
  user,
  isBarre,
  isRoot,
  correctHere,
  showAnswer,
  checked,
  right,
  note,
  onClick,
}) {
  const dot = renderDot({
    user,
    isBarre,
    checked,
    right,
    isRoot,
    showAnswer,
    correctHere,
    note,
  });

  const stringClass = isOpen
    ? "border-r-4 border-stone-300/80"
    : "border-r border-stone-700/70";

  return (
    <button
      onClick={onClick}
      className={`w-9 h-11 shrink-0 relative grid place-items-center ${stringClass}`}
    >
      <span
        className={`pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 ${thick} bg-stone-500/70`}
      />
      <span className="relative z-10">{dot}</span>
    </button>
  );
}

function renderDot({
  user,
  isBarre,
  checked,
  right,
  isRoot,
  showAnswer,
  correctHere,
  note,
}) {
  if (user) {
    let color = "bg-amber-400 text-stone-950";
    if (checked) color = right ? "bg-emerald-500 text-white" : "bg-rose-500 text-white";
    const ring = isRoot && (!checked || right) ? "ring-2 ring-yellow-200" : "";
    // Nota vinda da pestana (não colocada dedo a dedo): levemente atenuada.
    const fromBarre = isBarre && !checked ? "opacity-70" : "";
    return (
      <span
        className={`grid place-items-center w-7 h-7 rounded-full text-[10px] font-semibold ${color} ${ring} ${fromBarre}`}
      >
        {note || ""}
      </span>
    );
  }

  if (showAnswer && correctHere) {
    const outline = isRoot
      ? "border-yellow-300 text-yellow-200"
      : "border-amber-400/70 text-amber-300/80";
    return (
      <span
        className={`grid place-items-center w-7 h-7 rounded-full border-2 text-[10px] font-semibold ${outline}`}
      >
        {note || ""}
      </span>
    );
  }

  if (note) {
    return <span className="text-[9px] text-stone-600">{note}</span>;
  }

  return null;
}
