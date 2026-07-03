import { Dice5, Music4 } from "lucide-react";
import { NOTES_EN, NOTES_PT } from "../../constants/notes.js";
import { SHAPE_PT } from "../../constants/shapes.js";

export function ChordSelectors({
  rootPc,
  shape,
  validShapes,
  showNotes,
  onRootChange,
  onShapeChange,
  onRandomize,
  onToggleNotes,
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-stone-400">Acorde</span>
        <select
          value={rootPc}
          onChange={(e) => onRootChange(Number(e.target.value))}
          className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
        >
          {NOTES_PT.map((n, i) => (
            <option key={i} value={i}>{`${n} (${NOTES_EN[i]})`}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-stone-400">Forma</span>
        <select
          value={shape}
          onChange={(e) => onShapeChange(e.target.value)}
          className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
        >
          {validShapes.map((s) => (
            <option key={s} value={s}>{`${SHAPE_PT[s]} (${s})`}</option>
          ))}
        </select>
      </label>

      <button
        onClick={onRandomize}
        className="flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium px-4 py-2 text-sm transition-colors"
      >
        <Dice5 className="w-4 h-4" /> Sortear
      </button>

      <button
        onClick={onToggleNotes}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border transition-colors ${
          showNotes
            ? "bg-stone-800 border-stone-600"
            : "bg-stone-900 border-stone-800 hover:border-stone-600"
        }`}
      >
        <Music4 className="w-4 h-4" /> Notas
      </button>
    </div>
  );
}
