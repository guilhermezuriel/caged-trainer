import { SHAPE_PT } from "../../constants/shapes.js";

export function Feedback({ allCorrect, correctCount, shape }) {
  const styles = allCorrect
    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
    : "bg-rose-500/10 border-rose-500/30 text-rose-300";

  return (
    <div className={`rounded-lg px-4 py-3 text-sm border ${styles}`}>
      {allCorrect ? (
        <span>Perfeito — forma de {SHAPE_PT[shape]} montada certinha.</span>
      ) : (
        <span>
          Ainda não. {correctCount} de 6 cordas certas — as vermelhas estão fora
          do lugar.
        </span>
      )}
    </div>
  );
}
