import { useCallback, useEffect, useState } from "react";

export function useCountdown({ mode, duration, onExpire }) {
  const [seconds, setSeconds] = useState(mode === "down" ? duration : 0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || mode === "off") return;
    const id = setInterval(() => {
      setSeconds((s) => (mode === "up" ? s + 1 : Math.max(0, s - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  useEffect(() => {
    if (mode === "down" && running && seconds === 0) {
      setRunning(false);
      onExpire?.();
    }
  }, [seconds, running, mode, onExpire]);

  const start = useCallback(() => {
    if (mode === "down" && seconds === 0) setSeconds(duration);
    setRunning(true);
  }, [mode, seconds, duration]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRunning(false);
    setSeconds(mode === "down" ? duration : 0);
  }, [mode, duration]);

  const setMode = useCallback(
    (nextMode) => {
      setRunning(false);
      setSeconds(nextMode === "down" ? duration : 0);
    },
    [duration],
  );

  const setDuration = useCallback(
    (nextDuration) => {
      setRunning(false);
      if (mode === "down") setSeconds(nextDuration);
    },
    [mode],
  );

  return {
    seconds,
    running,
    start,
    pause,
    reset,
    setSeconds,
    setRunning,
    setMode,
    setDuration,
  };
}
