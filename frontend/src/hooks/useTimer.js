import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialSeconds = 0, onExpire) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            onExpire?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onExpire]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newSeconds = initialSeconds) => {
    setSeconds(newSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  return { seconds, isRunning, start, pause, reset };
};

export const useElapsedTimer = () => {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    intervalRef.current = setInterval(() => setElapsed((prev) => prev + 1), 1000);
  }, []);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    return elapsed;
  }, [elapsed]);

  const reset = useCallback(() => setElapsed(0), []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { elapsed, start, stop, reset };
};
