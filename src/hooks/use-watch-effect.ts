import { EffectCallback, useEffect, useRef } from 'react';

export const useWatchEffect = (callback: EffectCallback, deps: any[] = []) => {
  const isFirstMount = useRef(false);

  useEffect(() => {
    return () => {
      isFirstMount.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isFirstMount.current) {
      isFirstMount.current = true;
    } else {
      return callback();
    }
  }, deps);
};
