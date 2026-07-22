import { CheckCircle2, Dice5, Sparkles, Trophy, X } from "lucide-react";
import { NOTES_EN, NOTES_PT } from "../../constants/notes.js";
import { SHAPE_PT } from "../../constants/shapes.js";

function chordLabel(rootPc, quality) {
  const m = quality === "menor" ? "m" : "";
  return `${NOTES_PT[rootPc]}${m} (${NOTES_EN[rootPc]}${m})`;
}

export function SessionPanel({
  session,
  rootPc,
  quality,
  daily,
  onStart,
  onRandom,
  onDaily,
  onExit,
  onRestart,
}) {
  if (!session) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 space-y-3">
        <div>
          <p className="text-sm font-medium text-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Masterizar acorde
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Monte, uma a uma, todas as formas CAGED de um acorde ao longo do
            braço. Acertou, avança sozinho.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onStart}
            className="flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium px-4 py-2 text-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Iniciar com {chordLabel(rootPc, quality)}
          </button>
          <button
            onClick={onRandom}
            className="flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm hover:border-stone-500 transition-colors"
          >
            <Dice5 className="w-4 h-4" /> Aleatório
          </button>
          <button
            onClick={onDaily}
            className="rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-300 hover:border-stone-600 transition-colors"
          >
            Acorde do dia: {chordLabel(daily.rootPc, daily.quality)}
          </button>
        </div>
      </div>
    );
  }

  const { forms, index, done } = session;

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 space-y-3">
        <p className="text-sm font-medium text-emerald-300 flex items-center gap-2">
          <Trophy className="w-4 h-4" /> Sessão concluída!
        </p>
        <p className="text-xs text-stone-400">
          Você passou por todas as {forms.length} formas de{" "}
          {chordLabel(session.rootPc, session.quality)}.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onRestart}
            className="rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium px-4 py-2 text-sm transition-colors"
          >
            Nova sessão
          </button>
          <button
            onClick={onExit}
            className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm hover:border-stone-500 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-amber-200">
          Sessão · {chordLabel(session.rootPc, session.quality)}
        </p>
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200 transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Sair
        </button>
      </div>

      <div className="flex items-center gap-2">
        {forms.map((f, i) => {
          const state = i < index ? "done" : i === index ? "current" : "todo";
          return (
            <div
              key={f}
              className={`flex-1 flex flex-col items-center gap-1 rounded-lg py-2 text-xs ${
                state === "current"
                  ? "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/40"
                  : state === "done"
                    ? "text-emerald-400/80"
                    : "text-stone-500"
              }`}
            >
              {state === "done" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span className="font-semibold">{SHAPE_PT[f]}</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-stone-400 tabular-nums">
        Forma {index + 1} de {forms.length} — monte {SHAPE_PT[forms[index]]} (
        {forms[index]}) e confira.
      </p>
    </div>
  );
}
