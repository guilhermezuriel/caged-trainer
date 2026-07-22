import { useRef, useState } from "react";
import { NUM_FRETS } from "../../constants/shapes.js";

// Larguras fixas do grid do braço (correspondem às classes Tailwind).
const LABEL_W = 56; // w-14
const MUTE_W = 36; // w-9
const FRET_W = 36; // w-9
const FRET_ORIGIN = LABEL_W + MUTE_W; // início da casa 0
const BAR_W = 14;

const fretToX = (f) => FRET_ORIGIN + f * FRET_W + FRET_W / 2;

// Barra da pestana: capotraste vertical arrastável sobre as cordas.
export function BarreBar({ barreFret, containerRef, onMove }) {
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const barRef = useRef(null);

  if (barreFret === null) return null;

  const fretFromClientX = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const localX = clientX - rect.left;
    const f = Math.round((localX - FRET_ORIGIN - FRET_W / 2) / FRET_W);
    return Math.max(0, Math.min(NUM_FRETS, f));
  };

  const left = fretToX(barreFret) - BAR_W / 2;

  return (
    <div
      ref={barRef}
      onPointerDown={(e) => {
        e.preventDefault();
        try {
          barRef.current?.setPointerCapture(e.pointerId);
        } catch {
          /* pointer capture não essencial */
        }
        draggingRef.current = true;
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current) return;
        const f = fretFromClientX(e.clientX);
        if (f !== null && f !== barreFret) onMove?.(f);
      }}
      onPointerUp={(e) => {
        barRef.current?.releasePointerCapture?.(e.pointerId);
        draggingRef.current = false;
        setDragging(false);
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
        setDragging(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") onMove?.(Math.max(0, barreFret - 1));
        if (e.key === "ArrowRight") onMove?.(Math.min(NUM_FRETS, barreFret + 1));
      }}
      role="slider"
      tabIndex={0}
      aria-label="Posição da pestana"
      aria-valuenow={barreFret}
      aria-valuemin={0}
      aria-valuemax={NUM_FRETS}
      title="Arraste para mover a pestana"
      className={`absolute top-0 bottom-0 z-20 flex flex-col items-center outline-none cursor-grab active:cursor-grabbing touch-none focus-visible:ring-2 focus-visible:ring-amber-200/70 rounded-full ${
        dragging ? "cursor-grabbing" : ""
      }`}
      style={{ left, width: BAR_W }}
    >
      <span
        className={`flex-1 w-2.5 rounded-full bg-amber-400 shadow-[0_0_0_1px_rgba(0,0,0,0.4)] ${
          dragging ? "ring-2 ring-amber-200/70" : ""
        }`}
      />
    </div>
  );
}
