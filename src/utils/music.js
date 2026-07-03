import { NOTES_PT, OPEN_PITCH } from "../constants/notes.js";
import { SHAPES } from "../constants/shapes.js";

export function computeCorrect(quality, rootPc, shape) {
  const s = SHAPES[quality][shape];
  const base = (((rootPc - s.off) % 12) + 12) % 12;
  return s.rel.map((rel) => (rel === null ? "x" : base + rel));
}

export function noteAt(stringIdx, fret) {
  return NOTES_PT[(OPEN_PITCH[stringIdx] + fret) % 12];
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const r = seconds % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
