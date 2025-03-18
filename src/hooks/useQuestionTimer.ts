import { useState, useEffect, useCallback } from 'react';

interface UseQuestionTimerProps {
  duration: number; // in seconds
  onTimeout?: () => void;
  isActive?: boolean;
}

export function useQuestionTimer({
  duration,
  onTimeout,
  isActive = true,
}: UseQuestionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(isActive);

  // Reset timer to initial duration
  const resetTimer = useCallback((newDuration?: number) => {
    setTimeRemaining(newDuration || duration);
    setIsRunning(true);
  }, [duration]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Effect for countdown
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeRemaining, onTimeout]);

  // Update running state when isActive changes
  useEffect(() => {
    setIsRunning(isActive);
  }, [isActive]);

  return {
    timeRemaining,
    isRunning,
    resetTimer,
    pauseTimer,
    resumeTimer,
    percentage: (timeRemaining / duration) * 100,
  };
}