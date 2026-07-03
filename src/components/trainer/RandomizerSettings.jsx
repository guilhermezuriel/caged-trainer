import { NOTES_PT } from "../../constants/notes.js";
import { ALL_SHAPES, SHAPES, SHAPE_PT } from "../../constants/shapes.js";
import { Chip } from "../ui/Chip.jsx";

export function RandomizerSettings({
  quality,
  enabledRoots,
  enabledShapes,
  onToggleRoot,
  onSetAllRoots,
  onToggleShape,
  onSetAllShapes,
}) {
  return (
    <details className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
      <summary className="cursor-pointer text-sm font-medium text-stone-200 select-none">
        Personalizar sorteio — fixar acordes e formas
      </summary>
      <div className="mt-4 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-stone-400">
              Acordes no sorteio
            </span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => onSetAllRoots(true)}
                className="text-amber-400 hover:text-amber-300"
              >
                Todos
              </button>
              <button
                onClick={() => onSetAllRoots(false)}
                className="text-stone-500 hover:text-stone-300"
              >
                Nenhum
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {NOTES_PT.map((n, i) => (
              <Chip
                key={i}
                active={enabledRoots[i]}
                onClick={() => onToggleRoot(i)}
              >
                {n}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-stone-400">
              Formas no sorteio
            </span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={onSetAllShapes}
                className="text-amber-400 hover:text-amber-300"
              >
                Todas
              </button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {ALL_SHAPES.map((s) => {
              const disabled = !SHAPES[quality][s];
              return (
                <Chip
                  key={s}
                  disabled={disabled}
                  active={enabledShapes[s] && !disabled}
                  onClick={() => !disabled && onToggleShape(s)}
                >
                  {SHAPE_PT[s]}
                </Chip>
              );
            })}
          </div>
          {quality === "menor" && (
            <p className="text-xs text-stone-500 mt-2">
              As formas de Dó e Sol menores não existem de forma prática na
              guitarra — por isso só Mi, Lá e Ré aparecem no modo menor.
            </p>
          )}
        </div>

        <p className="text-xs text-stone-500">
          Dica: marque só uma forma para treinar ela em todos os acordes, ou só
          um acorde para vê-lo em todas as formas.
        </p>
      </div>
    </details>
  );
}
