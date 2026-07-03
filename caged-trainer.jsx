import React, { useState, useMemo, useEffect } from "react";
import {
  Dice5, Check, Eye, EyeOff, Eraser, Flame, Music4, Guitar,
  Play, Pause, RotateCcw, Timer, BookOpen, Target, Dumbbell,
} from "lucide-react";

// ---------- Notas ----------
const OPEN_PITCH = [4, 9, 2, 7, 11, 4]; // idx 0 = corda 6 (Mi grave) ... 5 = corda 1
const STRING_NUM = [6, 5, 4, 3, 2, 1];
const NOTES_PT = ["Dó","Dó#","Ré","Ré#","Mi","Fá","Fá#","Sol","Sol#","Lá","Lá#","Si"];
const NOTES_EN = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

// ---------- Formas CAGED ----------
// rel: idx 0 = corda 6 ... 5 = corda 1 (null = abafada). off: base = (tônica - off) mod 12. root: corda da tônica.
const SHAPES = {
  maior: {
    C: { rel: [null, 3, 2, 0, 1, 0], off: 0, root: 1 },
    A: { rel: [null, 0, 2, 2, 2, 0], off: 9, root: 1 },
    G: { rel: [3, 2, 0, 0, 0, 3], off: 7, root: 0 },
    E: { rel: [0, 2, 2, 1, 0, 0], off: 4, root: 0 },
    D: { rel: [null, null, 0, 2, 3, 2], off: 2, root: 2 },
  },
  menor: {
    E: { rel: [0, 2, 2, 0, 0, 0], off: 4, root: 0 },
    A: { rel: [null, 0, 2, 2, 1, 0], off: 9, root: 1 },
    D: { rel: [null, null, 0, 2, 3, 1], off: 2, root: 2 },
  },
};
const SHAPE_PT = { C: "Dó", A: "Lá", G: "Sol", E: "Mi", D: "Ré" };
const ALL_SHAPES = ["C", "A", "G", "E", "D"];
const NUM_FRETS = 14;

function computeCorrect(quality, rootPc, shape) {
  const s = SHAPES[quality][shape];
  const base = (((rootPc - s.off) % 12) + 12) % 12;
  return s.rel.map((rel) => (rel === null ? "x" : base + rel));
}
function noteAt(stringIdx, fret) {
  return NOTES_PT[(OPEN_PITCH[stringIdx] + fret) % 12];
}
function fmt(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

// ---------- Acordes de consulta ----------
const REF = {
  "Maiores": [
    { name: "Dó (C)", f: ["x", 3, 2, 0, 1, 0] },
    { name: "Ré (D)", f: ["x", "x", 0, 2, 3, 2] },
    { name: "Mi (E)", f: [0, 2, 2, 1, 0, 0] },
    { name: "Fá (F)", f: [1, 3, 3, 2, 1, 1] },
    { name: "Sol (G)", f: [3, 2, 0, 0, 0, 3] },
    { name: "Lá (A)", f: ["x", 0, 2, 2, 2, 0] },
  ],
  "Menores": [
    { name: "Mim (Em)", f: [0, 2, 2, 0, 0, 0] },
    { name: "Lám (Am)", f: ["x", 0, 2, 2, 1, 0] },
    { name: "Rém (Dm)", f: ["x", "x", 0, 2, 3, 1] },
  ],
  "Com sétima": [
    { name: "Mi7 (E7)", f: [0, 2, 0, 1, 0, 0] },
    { name: "Lá7 (A7)", f: ["x", 0, 2, 0, 2, 0] },
    { name: "Ré7 (D7)", f: ["x", "x", 0, 2, 1, 2] },
    { name: "Sol7 (G7)", f: [3, 2, 0, 0, 0, 1] },
    { name: "Dó7 (C7)", f: ["x", 3, 2, 3, 1, 0] },
    { name: "Si7 (B7)", f: ["x", 2, 1, 2, 0, 2] },
  ],
};

export default function App() {
  const [tab, setTab] = useState("treino");
  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 font-sans">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <header className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400">
              <Guitar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight leading-none">Estúdio CAGED</h1>
              <p className="text-xs text-stone-400 mt-1">Treine as formas e consulte os acordes</p>
            </div>
          </div>
          <nav className="flex rounded-lg bg-stone-900 border border-stone-800 p-1 text-sm">
            <TabBtn active={tab === "treino"} onClick={() => setTab("treino")} icon={<Target className="w-4 h-4" />}>Treino</TabBtn>
            <TabBtn active={tab === "consulta"} onClick={() => setTab("consulta")} icon={<BookOpen className="w-4 h-4" />}>Consulta</TabBtn>
          </nav>
        </header>
        {tab === "treino" ? <Trainer /> : <Reference />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
        active ? "bg-amber-500 text-stone-950 font-medium" : "text-stone-300 hover:text-white"
      }`}
    >
      {icon} {children}
    </button>
  );
}

// ================= TREINO =================
function Trainer() {
  const [quality, setQuality] = useState("maior");
  const [rootPc, setRootPc] = useState(9);
  const [shape, setShape] = useState("E");
  const [board, setBoard] = useState(Array(6).fill(null));
  const [checked, setChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [streak, setStreak] = useState(0);

  // pools de sorteio
  const [enabledRoots, setEnabledRoots] = useState(Array(12).fill(true));
  const [enabledShapes, setEnabledShapes] = useState({ C: true, A: true, G: true, E: true, D: true });

  // sessão + timer
  const [rounds, setRounds] = useState(0);
  const [hits, setHits] = useState(0);
  const [scored, setScored] = useState(false);
  const [tMode, setTMode] = useState("off"); // off | up | down
  const [duration, setDuration] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const validShapes = Object.keys(SHAPES[quality]);
  const correct = useMemo(() => computeCorrect(quality, rootPc, shape), [quality, rootPc, shape]);
  const rootIdx = SHAPES[quality][shape].root;
  const perString = board.map((v, i) => v !== null && v === correct[i]);
  const allCorrect = correct.every((c, i) => board[i] === c);

  // timer tick
  useEffect(() => {
    if (!running || tMode === "off") return;
    const id = setInterval(() => {
      setSeconds((s) => (tMode === "up" ? s + 1 : Math.max(0, s - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [running, tMode]);

  // fim da contagem regressiva
  useEffect(() => {
    if (tMode === "down" && running && seconds === 0) {
      setRunning(false);
      setShowAnswer(true);
      setChecked(false);
    }
  }, [seconds, running, tMode]);

  function loadChallenge(q, r, s) {
    setQuality(q);
    setRootPc(r);
    setShape(s);
    setBoard(Array(6).fill(null));
    setChecked(false);
    setShowAnswer(false);
    setScored(false);
  }

  function randomize() {
    const roots = enabledRoots.map((b, i) => (b ? i : null)).filter((x) => x !== null);
    const pool = roots.length ? roots : [...Array(12).keys()];
    const shapesPool = validShapes.filter((s) => enabledShapes[s]);
    const sp = shapesPool.length ? shapesPool : validShapes;
    const r = pool[Math.floor(Math.random() * pool.length)];
    const s = sp[Math.floor(Math.random() * sp.length)];
    loadChallenge(quality, r, s);
    setRounds((x) => x + 1);
    if (tMode === "down") setSeconds(duration);
  }

  function setQual(q) {
    let s = shape;
    if (!SHAPES[q][s]) s = "E";
    loadChallenge(q, rootPc, s);
  }

  function place(i, value) {
    if (checked) setChecked(false);
    setBoard((prev) => {
      const next = [...prev];
      next[i] = next[i] === value ? null : value;
      return next;
    });
  }

  function doCheck() {
    setChecked(true);
    if (allCorrect) {
      setStreak((s) => s + 1);
      if (!scored) {
        setHits((h) => h + 1);
        setScored(true);
        if (tMode === "down") setRunning(false);
      }
    } else {
      setStreak(0);
    }
  }

  function startTimer() {
    if (tMode === "down" && seconds === 0) setSeconds(duration);
    setRunning(true);
  }
  function changeMode(m) {
    setTMode(m);
    setRunning(false);
    setSeconds(m === "down" ? duration : 0);
  }
  function changeDuration(d) {
    setDuration(d);
    setRunning(false);
    if (tMode === "down") setSeconds(d);
  }

  const timeLow = tMode === "down" && seconds <= 5 && running;

  return (
    <div className="space-y-5">
      {/* linha de status */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg bg-stone-900 border border-stone-800 p-1 text-sm">
          <QBtn active={quality === "maior"} onClick={() => setQual("maior")}>Maior</QBtn>
          <QBtn active={quality === "menor"} onClick={() => setQual("menor")}>Menor</QBtn>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 border border-stone-800">
          <Flame className={`w-4 h-4 ${streak > 0 ? "text-amber-400" : "text-stone-600"}`} />
          <span className="text-sm tabular-nums"><span className="font-semibold">{streak}</span><span className="text-stone-500"> seguidos</span></span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 border border-stone-800 text-sm">
          <Dumbbell className="w-4 h-4 text-stone-500" />
          <span className="tabular-nums text-stone-300">{hits}<span className="text-stone-600">/{rounds} rodadas</span></span>
          {rounds > 0 && (
            <button onClick={() => { setRounds(0); setHits(0); }} className="ml-1 text-stone-500 hover:text-stone-300" title="Zerar sessão">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* desafio */}
      <div className="rounded-xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-widest text-amber-400/80 mb-1">Desafio</p>
        <p className="text-lg sm:text-2xl leading-snug">
          Monte o acorde de{" "}
          <strong className="text-amber-300">{NOTES_PT[rootPc]}{quality === "menor" ? "m" : ""} <span className="text-amber-400/60 text-base">({NOTES_EN[rootPc]}{quality === "menor" ? "m" : ""})</span></strong>{" "}
          usando a forma de{" "}
          <strong className="text-amber-300">{SHAPE_PT[shape]} <span className="text-amber-400/60 text-base">({shape})</span></strong>
        </p>
      </div>

      {/* cronômetro */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-stone-500" />
            <div className="flex rounded-lg bg-stone-950 border border-stone-800 p-1 text-xs">
              <QBtn active={tMode === "off"} onClick={() => changeMode("off")}>Off</QBtn>
              <QBtn active={tMode === "up"} onClick={() => changeMode("up")}>Cronômetro</QBtn>
              <QBtn active={tMode === "down"} onClick={() => changeMode("down")}>Regressivo</QBtn>
            </div>
          </div>

          {tMode === "down" && (
            <div className="flex gap-1 text-xs">
              {[30, 60, 90].map((d) => (
                <button key={d} onClick={() => changeDuration(d)}
                  className={`rounded-md px-2.5 py-1.5 border ${duration === d ? "bg-amber-500 text-stone-950 border-amber-500 font-medium" : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-600"}`}>
                  {d}s
                </button>
              ))}
            </div>
          )}

          {tMode !== "off" && (
            <div className="flex items-center gap-3 ml-auto">
              <span className={`text-2xl font-semibold tabular-nums ${timeLow ? "text-rose-400" : "text-stone-100"}`}>{fmt(seconds)}</span>
              <button onClick={() => (running ? setRunning(false) : startTimer())}
                className="grid place-items-center w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950">
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={() => { setRunning(false); setSeconds(tMode === "down" ? duration : 0); }}
                className="grid place-items-center w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {tMode === "down" && (
          <p className="text-xs text-stone-500 mt-2">Acerte antes do tempo. Ao zerar, a resposta aparece — clique em Sortear para a próxima.</p>
        )}
      </div>

      {/* seletores manuais */}
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-stone-400">Acorde</span>
          <select value={rootPc} onChange={(e) => loadChallenge(quality, Number(e.target.value), shape)}
            className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500">
            {NOTES_PT.map((n, i) => <option key={i} value={i}>{`${n} (${NOTES_EN[i]})`}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-stone-400">Forma</span>
          <select value={shape} onChange={(e) => loadChallenge(quality, rootPc, e.target.value)}
            className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500">
            {validShapes.map((s) => <option key={s} value={s}>{`${SHAPE_PT[s]} (${s})`}</option>)}
          </select>
        </label>
        <button onClick={randomize} className="flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium px-4 py-2 text-sm transition-colors">
          <Dice5 className="w-4 h-4" /> Sortear
        </button>
        <button onClick={() => setShowNotes((v) => !v)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border transition-colors ${showNotes ? "bg-stone-800 border-stone-600" : "bg-stone-900 border-stone-800 hover:border-stone-600"}`}>
          <Music4 className="w-4 h-4" /> Notas
        </button>
      </div>

      {/* braço */}
      <Fretboard board={board} correct={correct} rootIdx={rootIdx} checked={checked}
        perString={perString} showAnswer={showAnswer} showNotes={showNotes} onPlace={place} />

      {checked && (
        <div className={`rounded-lg px-4 py-3 text-sm border ${allCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border-rose-500/30 text-rose-300"}`}>
          {allCorrect
            ? <span>Perfeito — forma de {SHAPE_PT[shape]} montada certinha.</span>
            : <span>Ainda não. {perString.filter(Boolean).length} de 6 cordas certas — as vermelhas estão fora do lugar.</span>}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button onClick={doCheck} className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-medium px-4 py-2 text-sm transition-colors">
          <Check className="w-4 h-4" /> Conferir
        </button>
        <button onClick={() => setShowAnswer((v) => !v)} className="flex items-center gap-2 rounded-lg bg-stone-900 border border-stone-700 hover:border-stone-500 px-4 py-2 text-sm transition-colors">
          {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} {showAnswer ? "Esconder" : "Ver resposta"}
        </button>
        <button onClick={() => loadChallenge(quality, rootPc, shape)} className="flex items-center gap-2 rounded-lg bg-stone-900 border border-stone-700 hover:border-stone-500 px-4 py-2 text-sm transition-colors">
          <Eraser className="w-4 h-4" /> Limpar
        </button>
      </div>

      {/* customização do sorteio */}
      <details className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
        <summary className="cursor-pointer text-sm font-medium text-stone-200 select-none">Personalizar sorteio — fixar acordes e formas</summary>
        <div className="mt-4 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-stone-400">Acordes no sorteio</span>
              <div className="flex gap-2 text-xs">
                <button onClick={() => setEnabledRoots(Array(12).fill(true))} className="text-amber-400 hover:text-amber-300">Todos</button>
                <button onClick={() => setEnabledRoots(Array(12).fill(false))} className="text-stone-500 hover:text-stone-300">Nenhum</button>
              </div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {NOTES_PT.map((n, i) => (
                <Chip key={i} active={enabledRoots[i]} onClick={() => setEnabledRoots((p) => p.map((v, k) => (k === i ? !v : v)))}>{n}</Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-stone-400">Formas no sorteio</span>
              <div className="flex gap-2 text-xs">
                <button onClick={() => setEnabledShapes({ C: true, A: true, G: true, E: true, D: true })} className="text-amber-400 hover:text-amber-300">Todas</button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {ALL_SHAPES.map((s) => {
                const disabled = !SHAPES[quality][s];
                return (
                  <Chip key={s} disabled={disabled} active={enabledShapes[s] && !disabled}
                    onClick={() => !disabled && setEnabledShapes((p) => ({ ...p, [s]: !p[s] }))}>
                    {SHAPE_PT[s]}
                  </Chip>
                );
              })}
            </div>
            {quality === "menor" && (
              <p className="text-xs text-stone-500 mt-2">As formas de Dó e Sol menores não existem de forma prática na guitarra — por isso só Mi, Lá e Ré aparecem no modo menor.</p>
            )}
          </div>
          <p className="text-xs text-stone-500">Dica: marque só uma forma para treinar ela em todos os acordes, ou só um acorde para vê-lo em todas as formas.</p>
        </div>
      </details>

      <Legend />
    </div>
  );
}

function QBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`rounded-md px-3 py-1.5 transition-colors ${active ? "bg-amber-500 text-stone-950 font-medium" : "text-stone-300 hover:text-white"}`}>
      {children}
    </button>
  );
}
function Chip({ active, disabled, onClick, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`rounded-lg px-2 py-2 text-sm border text-center transition-colors ${
        disabled ? "border-stone-800 text-stone-700 cursor-not-allowed"
        : active ? "bg-amber-500 border-amber-500 text-stone-950 font-medium"
        : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-600"}`}>
      {children}
    </button>
  );
}
function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-400">
      <span className="flex items-center gap-2"><D cls="bg-amber-400" /> sua nota</span>
      <span className="flex items-center gap-2"><D cls="bg-amber-400 ring-2 ring-yellow-200" /> tônica</span>
      <span className="flex items-center gap-2"><D cls="bg-emerald-500" /> certa</span>
      <span className="flex items-center gap-2"><D cls="bg-rose-500" /> errada</span>
      <span className="flex items-center gap-2"><D cls="border-2 border-amber-400/70" /> resposta</span>
      <span className="flex items-center gap-2"><span className="text-stone-500 font-bold">×</span> abafada</span>
    </div>
  );
}
function D({ cls }) { return <span className={`inline-block w-3.5 h-3.5 rounded-full ${cls}`} />; }

// ---------- Braço interativo ----------
const INLAYS = new Set([3, 5, 7, 9]);
function Fretboard({ board, correct, rootIdx, checked, perString, showAnswer, showNotes, onPlace }) {
  const rows = [5, 4, 3, 2, 1, 0];
  const frets = Array.from({ length: NUM_FRETS + 1 }, (_, f) => f);
  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 overflow-x-auto">
      <div className="min-w-max">
        <div className="flex select-none">
          <div className="w-14 shrink-0" />
          <div className="w-9 shrink-0 text-center text-[10px] text-stone-600 pb-1">✕</div>
          {frets.map((f) => (
            <div key={f} className="w-9 shrink-0 text-center text-[10px] text-stone-500 pb-1 tabular-nums relative">
              {f}
              {(INLAYS.has(f) || f === 12) && (
                <span className="absolute left-1/2 -translate-x-1/2 top-3 flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-stone-600" />
                  {f === 12 && <span className="w-1 h-1 rounded-full bg-stone-600" />}
                </span>
              )}
            </div>
          ))}
        </div>
        {rows.map((i) => {
          const thick = i <= 2 ? "h-0.5" : "h-px";
          return (
            <div key={i} className="flex items-stretch">
              <div className="w-14 shrink-0 flex items-center justify-end pr-2 text-xs">
                <span className="tabular-nums font-medium text-stone-400">{STRING_NUM[i]}</span>
                <span className="ml-1 text-stone-600">{NOTES_PT[OPEN_PITCH[i]]}</span>
              </div>
              <button onClick={() => onPlace(i, "x")} className="w-9 h-11 shrink-0 grid place-items-center border-r border-stone-800" title="Abafar">
                {board[i] === "x"
                  ? <span className="text-lg font-bold text-rose-400 leading-none">×</span>
                  : (showAnswer || checked) && correct[i] === "x"
                  ? <span className="text-lg font-bold text-amber-400/50 leading-none">×</span>
                  : <span className="text-sm text-stone-700 leading-none">×</span>}
              </button>
              {frets.map((f) => (
                <Cell key={f} isOpen={f === 0} thick={thick}
                  user={board[i] === f} isRoot={rootIdx === i} correctHere={correct[i] === f}
                  showAnswer={showAnswer} checked={checked} right={perString[i]}
                  note={showNotes ? noteAt(i, f) : null} onClick={() => onPlace(i, f)} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function Cell({ isOpen, thick, user, isRoot, correctHere, showAnswer, checked, right, note, onClick }) {
  let dot = null;
  if (user) {
    let color = "bg-amber-400 text-stone-950";
    if (checked) color = right ? "bg-emerald-500 text-white" : "bg-rose-500 text-white";
    const ring = isRoot && (!checked || right) ? "ring-2 ring-yellow-200" : "";
    dot = <span className={`grid place-items-center w-7 h-7 rounded-full text-[10px] font-semibold ${color} ${ring}`}>{note || ""}</span>;
  } else if (showAnswer && correctHere) {
    dot = <span className={`grid place-items-center w-7 h-7 rounded-full border-2 text-[10px] font-semibold ${isRoot ? "border-yellow-300 text-yellow-200" : "border-amber-400/70 text-amber-300/80"}`}>{note || ""}</span>;
  } else if (note) {
    dot = <span className="text-[9px] text-stone-600">{note}</span>;
  }
  return (
    <button onClick={onClick}
      className={`w-9 h-11 shrink-0 relative grid place-items-center ${isOpen ? "border-r-4 border-stone-300/80" : "border-r border-stone-700/70"}`}>
      <span className={`pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 ${thick} bg-stone-500/70`} />
      <span className="relative z-10">{dot}</span>
    </button>
  );
}

// ================= CONSULTA =================
function Reference() {
  return (
    <div className="space-y-7">
      <p className="text-sm text-stone-400">Diagramas na posição aberta. Leia da esquerda (corda 6, Mi grave) para a direita (corda 1, Mi agudo). O = solta, × = abafada.</p>
      {Object.entries(REF).map(([title, chords]) => (
        <section key={title}>
          <h2 className="text-sm uppercase tracking-widest text-amber-400/80 mb-3">{title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {chords.map((c) => <ChordCard key={c.name} chord={c} />)}
          </div>
        </section>
      ))}
      <p className="text-xs text-stone-500">Os acordes com sétima aqui são dominantes (o formato que você mais usa em blues e transições). Dá pra abrir a aba Treino e conferir qualquer uma dessas formas no braço.</p>
    </div>
  );
}
function ChordCard({ chord }) {
  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 flex flex-col items-center">
      <ChordDiagram frets={chord.f} />
      <span className="mt-2 text-sm font-medium text-stone-200">{chord.name}</span>
    </div>
  );
}
function ChordDiagram({ frets }) {
  const W = 104, H = 128, padX = 16, padTop = 30, rows = 4;
  const colGap = (W - 2 * padX) / 5;
  const rowGap = (H - padTop - 12) / rows;
  const xs = (i) => padX + i * colGap; // i: 0=corda6 (esquerda)
  const line = "#57534e", nut = "#d6d3d1", dotC = "#fbbf24", txt = "#a8a29e";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="104" height="128" role="img">
      {/* nut */}
      <rect x={padX} y={padTop - 3} width={W - 2 * padX} height={3} fill={nut} />
      {/* frets */}
      {Array.from({ length: rows }, (_, r) => (
        <line key={r} x1={padX} y1={padTop + (r + 1) * rowGap} x2={W - padX} y2={padTop + (r + 1) * rowGap} stroke={line} strokeWidth="1" />
      ))}
      {/* strings */}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={xs(i)} y1={padTop} x2={xs(i)} y2={padTop + rows * rowGap} stroke={line} strokeWidth="1" />
      ))}
      {/* markers + dots */}
      {frets.map((v, i) => {
        const x = xs(i);
        if (v === "x") return <text key={i} x={x} y={padTop - 8} fontSize="11" fill={txt} textAnchor="middle">×</text>;
        if (v === 0) return <circle key={i} cx={x} cy={padTop - 11} r="4" fill="none" stroke={txt} strokeWidth="1.2" />;
        const cy = padTop + (v - 0.5) * rowGap;
        return <circle key={i} cx={x} cy={cy} r="6.5" fill={dotC} />;
      })}
    </svg>
  );
}
