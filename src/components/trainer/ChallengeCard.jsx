import { NOTES_EN, NOTES_PT } from "../../constants/notes.js";
import { SHAPE_PT } from "../../constants/shapes.js";

export function ChallengeCard({ quality, rootPc, shape }) {
  const minor = quality === "menor" ? "m" : "";
  return (
    <div className="rounded-xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 p-4 sm:p-5">
      <p className="text-xs uppercase tracking-widest text-amber-400/80 mb-1">
        Desafio
      </p>
      <p className="text-lg sm:text-2xl leading-snug">
        Monte o acorde de{" "}
        <strong className="text-amber-300">
          {NOTES_PT[rootPc]}
          {minor}{" "}
          <span className="text-amber-400/60 text-base">
            ({NOTES_EN[rootPc]}
            {minor})
          </span>
        </strong>{" "}
        usando a forma de{" "}
        <strong className="text-amber-300">
          {SHAPE_PT[shape]}{" "}
          <span className="text-amber-400/60 text-base">({shape})</span>
        </strong>
      </p>
    </div>
  );
}
