import { ChordDiagram } from "./ChordDiagram.jsx";

export function ChordCard({ chord }) {
  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 flex flex-col items-center">
      <ChordDiagram frets={chord.f} />
      <span className="mt-2 text-sm font-medium text-stone-200">{chord.name}</span>
    </div>
  );
}
