import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SHAPES } from "../../constants/shapes.js";
import { useCountdown } from "../../hooks/useCountdown.js";
import { chordOfDay } from "../../utils/dailyChord.js";
import { computeCorrect, deriveBoard } from "../../utils/music.js";
import { Fretboard } from "../fretboard/Fretboard.jsx";
import { Legend } from "../ui/Legend.jsx";
import { ActionButtons } from "./ActionButtons.jsx";
import { ChallengeCard } from "./ChallengeCard.jsx";
import { ChordSelectors } from "./ChordSelectors.jsx";
import { Feedback } from "./Feedback.jsx";
import { RandomizerSettings } from "./RandomizerSettings.jsx";
import { SessionPanel } from "./SessionPanel.jsx";
import { StatusBar } from "./StatusBar.jsx";
import { TimerPanel } from "./TimerPanel.jsx";

const EMPTY_BOARD = Array(6).fill(null);
const DEFAULT_ENABLED_SHAPES = { C: true, A: true, G: true, E: true, D: true };
const DEFAULT_DURATION = 30;
const ADVANCE_DELAY = 1100;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Trainer() {
  const [quality, setQuality] = useState("maior");
  const [rootPc, setRootPc] = useState(9);
  const [shape, setShape] = useState("E");
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [barreFret, setBarreFret] = useState(null);
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

  const [session, setSession] = useState(null);
  const sessionRef = useRef(null);
  const advanceTimer = useRef(null);
  const daily = useMemo(() => chordOfDay(), []);

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
  const effective = deriveBoard(board, barreFret);
  const perString = effective.map((v, i) => v !== null && v === correct[i]);
  const allCorrect = correct.every((c, i) => effective[i] === c);
  const correctCount = perString.filter(Boolean).length;

  const loadChallenge = useCallback((q, r, s) => {
    setQuality(q);
    setRootPc(r);
    setShape(s);
    setBoard(EMPTY_BOARD);
    setBarreFret(null);
    setChecked(false);
    setShowAnswer(false);
    setScored(false);
  }, []);

  const updateSession = useCallback((next) => {
    sessionRef.current = next;
    setSession(next);
  }, []);

  const startSession = useCallback(
    (r, q) => {
      const forms = shuffle(Object.keys(SHAPES[q]));
      updateSession({ rootPc: r, quality: q, forms, index: 0, done: false });
      loadChallenge(q, r, forms[0]);
    },
    [loadChallenge, updateSession],
  );

  const advanceSession = useCallback(() => {
    const s = sessionRef.current;
    if (!s || s.done) return;
    const next = s.index + 1;
    if (next >= s.forms.length) {
      updateSession({ ...s, done: true });
      setShowAnswer(false);
      setChecked(false);
    } else {
      updateSession({ ...s, index: next });
      loadChallenge(s.quality, s.rootPc, s.forms[next]);
    }
  }, [loadChallenge, updateSession]);

  const endSession = useCallback(() => {
    clearTimeout(advanceTimer.current);
    updateSession(null);
  }, [updateSession]);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const handleToggleBarre = () => {
    if (checked) setChecked(false);
    setBarreFret((prev) => (prev === null ? 0 : null));
  };

  const handleMoveBarre = (f) => {
    if (checked) setChecked(false);
    setBarreFret(f);
  };

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
      if (sessionRef.current && !sessionRef.current.done) {
        clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(advanceSession, ADVANCE_DELAY);
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

      <SessionPanel
        session={session}
        rootPc={rootPc}
        quality={quality}
        daily={daily}
        onStart={() => startSession(rootPc, quality)}
        onRandom={() =>
          startSession(Math.floor(Math.random() * 12), quality)
        }
        onDaily={() => startSession(daily.rootPc, daily.quality)}
        onExit={endSession}
        onRestart={() =>
          startSession(session.rootPc, session.quality)
        }
      />

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
        hideSelectors={session !== null}
        onRootChange={(r) => loadChallenge(quality, r, shape)}
        onShapeChange={(s) => loadChallenge(quality, rootPc, s)}
        onRandomize={handleRandomize}
        onToggleNotes={() => setShowNotes((v) => !v)}
      />

      <Fretboard
        board={board}
        effective={effective}
        barreFret={barreFret}
        correct={correct}
        rootIdx={rootIdx}
        checked={checked}
        perString={perString}
        showAnswer={showAnswer}
        showNotes={showNotes}
        onPlace={handlePlace}
        onToggleBarre={handleToggleBarre}
        onMoveBarre={handleMoveBarre}
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

      {!session && (
        <RandomizerSettings
          quality={quality}
          enabledRoots={enabledRoots}
          enabledShapes={enabledShapes}
          onToggleRoot={handleToggleRoot}
          onSetAllRoots={handleSetAllRoots}
          onToggleShape={handleToggleShape}
          onSetAllShapes={handleSetAllShapes}
        />
      )}

      <Legend />
    </div>
  );
}
