import { useState, useCallback, useRef } from 'react';

export const useVoteThrottle = (delay: number = 1000) => {
  const [isThrottled, setIsThrottled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledVote = useCallback((callback: () => void) => {
    if (!isThrottled) {
      callback();
      setIsThrottled(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsThrottled(false);
      }, delay);
    }
  }, [isThrottled, delay]);

  return { isThrottled, throttledVote };
};