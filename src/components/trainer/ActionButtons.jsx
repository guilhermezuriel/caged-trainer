import { Check, Eraser, Eye, EyeOff } from "lucide-react";

export function ActionButtons({ showAnswer, onCheck, onToggleAnswer, onClear }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onCheck}
        className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-medium px-4 py-2 text-sm transition-colors"
      >
        <Check className="w-4 h-4" /> Conferir
      </button>
      <button
        onClick={onToggleAnswer}
        className="flex items-center gap-2 rounded-lg bg-stone-900 border border-stone-700 hover:border-stone-500 px-4 py-2 text-sm transition-colors"
      >
        {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {showAnswer ? "Esconder" : "Ver resposta"}
      </button>
      <button
        onClick={onClear}
        className="flex items-center gap-2 rounded-lg bg-stone-900 border border-stone-700 hover:border-stone-500 px-4 py-2 text-sm transition-colors"
      >
        <Eraser className="w-4 h-4" /> Limpar
      </button>
    </div>
  );
}
