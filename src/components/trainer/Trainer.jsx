import { useCallback, useMemo, useState } from "react";
import { SHAPES } from "../../constants/shapes.js";
import { useCountdown } from "../../hooks/useCountdown.js";
import { computeCorrect } from "../../utils/music.js";
import { Fretboard } from "../fretboard/Fretboard.jsx";
import { Legend } from "../ui/Legend.jsx";
import { ActionButtons } from "./ActionButtons.jsx";
import { ChallengeCard } from "./ChallengeCard.jsx";
import { ChordSelectors } from "./ChordSelectors.jsx";
import { Feedback } from "./Feedback.jsx";
import { RandomizerSettings } from "./RandomizerSettings.jsx";
import { StatusBar } from "./StatusBar.jsx";
import { TimerPanel } from "./TimerPanel.jsx";

const EMPTY_BOARD = Array(6).fill(null);
const DEFAULT_ENABLED_SHAPES = { C: true, A: true, G: true, E: true, D: true };
const DEFAULT_DURATION = 30;

export function Trainer() {
  const [quality, setQuality] = useState("maior");
  const [rootPc, setRootPc] = useState(9);
  const [shape, setShape] = useState("E");
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [checked, setChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [streak, setStreak] = useState(0);

  const [enabledRoots, setEnabledRoots] = useState(Array(12).fill(true));
  const [enabledShapes, setEnabledShapes] = useState(DEFAULT_ENABLED_SHAPES);

  const [rounds, setRounds] = useState(0);
  const [hits, setHits] = useState(0);
  const [scored, setScored] = useState(false);

  const [timerMode, setTimerMode] = useState("off");
  const [duration, setDurationState] = useState(DEFAULT_DURATION);

  const onTimerExpire = useCallback(() => {
    setShowAnswer(true);
    setChecked(false);
  }, []);

  const timer = useCountdown({
    mode: timerMode,
    duration,
    onExpire: onTimerExpire,
  });

  const validShapes = Object.keys(SHAPES[quality]);
  const correct = useMemo(
    () => computeCorrect(quality, rootPc, shape),
    [quality, rootPc, shape],
  );
  const rootIdx = SHAPES[quality][shape].root;
  const perString = board.map((v, i) => v !== null && v === correct[i]);
  const allCorrect = correct.every((c, i) => board[i] === c);
  const correctCount = perString.filter(Boolean).length;

  const loadChallenge = useCallback((q, r, s) => {
    setQuality(q);
    setRootPc(r);
    setShape(s);
    setBoard(EMPTY_BOARD);
    setChecked(false);
    setShowAnswer(false);
    setScored(false);
  }, []);

  const handleQualityChange = (q) => {
    const nextShape = SHAPES[q][shape] ? shape : "E";
    loadChallenge(q, rootPc, nextShape);
  };

  const handleRandomize = () => {
    const roots = enabledRoots
      .map((b, i) => (b ? i : null))
      .filter((x) => x !== null);
    const rootPool = roots.length ? roots : [...Array(12).keys()];
    const shapesPool = validShapes.filter((s) => enabledShapes[s]);
    const shapePool = shapesPool.length ? shapesPool : validShapes;

    const nextRoot = rootPool[Math.floor(Math.random() * rootPool.length)];
    const nextShape = shapePool[Math.floor(Math.random() * shapePool.length)];

    loadChallenge(quality, nextRoot, nextShape);
    setRounds((x) => x + 1);
    if (timerMode === "down") timer.setSeconds(duration);
  };

  const handlePlace = (i, value) => {
    if (checked) setChecked(false);
    setBoard((prev) => {
      const next = [...prev];
      next[i] = next[i] === value ? null : value;
      return next;
    });
  };

  const handleCheck = () => {
    setChecked(true);
    if (allCorrect) {
      setStreak((s) => s + 1);
      if (!scored) {
        setHits((h) => h + 1);
        setScored(true);
        if (timerMode === "down") timer.setRunning(false);
      }
    } else {
      setStreak(0);
    }
  };

  const handleModeChange = (m) => {
    setTimerMode(m);
    timer.setMode(m);
  };

  const handleDurationChange = (d) => {
    setDurationState(d);
    timer.setDuration(d);
  };

  const handleResetSession = () => {
    setRounds(0);
    setHits(0);
  };

  const handleToggleRoot = (i) =>
    setEnabledRoots((prev) => prev.map((v, k) => (k === i ? !v : v)));

  const handleSetAllRoots = (value) =>
    setEnabledRoots(Array(12).fill(value));

  const handleToggleShape = (s) =>
    setEnabledShapes((prev) => ({ ...prev, [s]: !prev[s] }));

  const handleSetAllShapes = () => setEnabledShapes(DEFAULT_ENABLED_SHAPES);

  return (
    <div className="space-y-5">
      <StatusBar
        quality={quality}
        onQualityChange={handleQualityChange}
        streak={streak}
        hits={hits}
        rounds={rounds}
        onResetSession={handleResetSession}
      />

      <ChallengeCard quality={quality} rootPc={rootPc} shape={shape} />

      <TimerPanel
        mode={timerMode}
        duration={duration}
        seconds={timer.seconds}
        running={timer.running}
        onModeChange={handleModeChange}
        onDurationChange={handleDurationChange}
        onStart={timer.start}
        onPause={timer.pause}
        onReset={timer.reset}
      />

      <ChordSelectors
        rootPc={rootPc}
        shape={shape}
        validShapes={validShapes}
        showNotes={showNotes}
        onRootChange={(r) => loadChallenge(quality, r, shape)}
        onShapeChange={(s) => loadChallenge(quality, rootPc, s)}
        onRandomize={handleRandomize}
        onToggleNotes={() => setShowNotes((v) => !v)}
      />

      <Fretboard
        board={board}
        correct={correct}
        rootIdx={rootIdx}
        checked={checked}
        perString={perString}
        showAnswer={showAnswer}
        showNotes={showNotes}
        onPlace={handlePlace}
      />

      {checked && (
        <Feedback
          allCorrect={allCorrect}
          correctCount={correctCount}
          shape={shape}
        />
      )}

      <ActionButtons
        showAnswer={showAnswer}
        onCheck={handleCheck}
        onToggleAnswer={() => setShowAnswer((v) => !v)}
        onClear={() => loadChallenge(quality, rootPc, shape)}
      />

      <RandomizerSettings
        quality={quality}
        enabledRoots={enabledRoots}
        enabledShapes={enabledShapes}
        onToggleRoot={handleToggleRoot}
        onSetAllRoots={handleSetAllRoots}
        onToggleShape={handleToggleShape}
        onSetAllShapes={handleSetAllShapes}
      />

      <Legend />
    </div>
  );
}
