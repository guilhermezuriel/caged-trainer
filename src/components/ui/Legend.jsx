function Dot({ className }) {
  return <span className={`inline-block w-3.5 h-3.5 rounded-full ${className}`} />;
}

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-400">
      <span className="flex items-center gap-2">
        <Dot className="bg-amber-400" /> sua nota
      </span>
      <span className="flex items-center gap-2">
        <Dot className="bg-amber-400 ring-2 ring-yellow-200" /> tônica
      </span>
      <span className="flex items-center gap-2">
        <Dot className="bg-emerald-500" /> certa
      </span>
      <span className="flex items-center gap-2">
        <Dot className="bg-rose-500" /> errada
      </span>
      <span className="flex items-center gap-2">
        <Dot className="border-2 border-amber-400/70" /> resposta
      </span>
      <span className="flex items-center gap-2">
        <span className="text-stone-500 font-bold">×</span> abafada
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block w-4 h-2 rounded-full bg-amber-400" /> pestana
        (cordas livres seguem a casa)
      </span>
    </div>
  );
}
