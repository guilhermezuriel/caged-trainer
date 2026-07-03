import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { formatTime } from "../../utils/music.js";
import { SegmentButton } from "../ui/SegmentButton.jsx";

const PRESETS = [30, 60, 90];

export function TimerPanel({
  mode,
  duration,
  seconds,
  running,
  onModeChange,
  onDurationChange,
  onStart,
  onPause,
  onReset,
}) {
  const timeLow = mode === "down" && seconds <= 5 && running;

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-stone-500" />
          <div className="flex rounded-lg bg-stone-950 border border-stone-800 p-1 text-xs">
            <SegmentButton
              active={mode === "off"}
              onClick={() => onModeChange("off")}
            >
              Off
            </SegmentButton>
            <SegmentButton
              active={mode === "up"}
              onClick={() => onModeChange("up")}
            >
              Cronômetro
            </SegmentButton>
            <SegmentButton
              active={mode === "down"}
              onClick={() => onModeChange("down")}
            >
              Regressivo
            </SegmentButton>
          </div>
        </div>

        {mode === "down" && (
          <div className="flex gap-1 text-xs">
            {PRESETS.map((d) => (
              <button
                key={d}
                onClick={() => onDurationChange(d)}
                className={`rounded-md px-2.5 py-1.5 border ${
                  duration === d
                    ? "bg-amber-500 text-stone-950 border-amber-500 font-medium"
                    : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-600"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        )}

        {mode !== "off" && (
          <div className="flex items-center gap-3 ml-auto">
            <span
              className={`text-2xl font-semibold tabular-nums ${
                timeLow ? "text-rose-400" : "text-stone-100"
              }`}
            >
              {formatTime(seconds)}
            </span>
            <button
              onClick={running ? onPause : onStart}
              className="grid place-items-center w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950"
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={onReset}
              className="grid place-items-center w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {mode === "down" && (
        <p className="text-xs text-stone-500 mt-2">
          Acerte antes do tempo. Ao zerar, a resposta aparece — clique em Sortear
          para a próxima.
        </p>
      )}
    </div>
  );
}
