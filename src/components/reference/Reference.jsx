import { REF } from "../../constants/reference.js";
import { ChordCard } from "./ChordCard.jsx";

export function Reference() {
  return (
    <div className="space-y-7">
      <p className="text-sm text-stone-400">
        Diagramas na posição aberta. Leia da esquerda (corda 6, Mi grave) para a
        direita (corda 1, Mi agudo). O = solta, × = abafada.
      </p>

      {Object.entries(REF).map(([title, chords]) => (
        <section key={title}>
          <h2 className="text-sm uppercase tracking-widest text-amber-400/80 mb-3">
            {title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {chords.map((c) => (
              <ChordCard key={c.name} chord={c} />
            ))}
          </div>
        </section>
      ))}

      <p className="text-xs text-stone-500">
        Os acordes com sétima aqui são dominantes (o formato que você mais usa em
        blues e transições). Dá pra abrir a aba Treino e conferir qualquer uma
        dessas formas no braço.
      </p>
    </div>
  );
}
