import { Dumbbell, Flame, RotateCcw } from "lucide-react";
import { SegmentButton } from "../ui/SegmentButton.jsx";

export function StatusBar({
  quality,
  onQualityChange,
  streak,
  hits,
  rounds,
  onResetSession,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-lg bg-stone-900 border border-stone-800 p-1 text-sm">
        <SegmentButton
          active={quality === "maior"}
          onClick={() => onQualityChange("maior")}
        >
          Maior
        </SegmentButton>
        <SegmentButton
          active={quality === "menor"}
          onClick={() => onQualityChange("menor")}
        >
          Menor
        </SegmentButton>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 border border-stone-800">
        <Flame
          className={`w-4 h-4 ${streak > 0 ? "text-amber-400" : "text-stone-600"}`}
        />
        <span className="text-sm tabular-nums">
          <span className="font-semibold">{streak}</span>
          <span className="text-stone-500"> seguidos</span>
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 border border-stone-800 text-sm">
        <Dumbbell className="w-4 h-4 text-stone-500" />
        <span className="tabular-nums text-stone-300">
          {hits}
          <span className="text-stone-600">/{rounds} rodadas</span>
        </span>
        {rounds > 0 && (
          <button
            onClick={onResetSession}
            className="ml-1 text-stone-500 hover:text-stone-300"
            title="Zerar sessão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
