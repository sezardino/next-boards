import { useEffect, useRef, useState } from 'react';

export const useDebouncedValue = <T = any>(
  value: T,
  wait: number,
  options = { leading: false },
) => {
  const [_value, setValue] = useState(value);
  const mountedRef = useRef<boolean | null>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<boolean | null>(false);

  const cancel = () => (timeoutRef.current ? clearTimeout(timeoutRef.current) : undefined);

  useEffect(() => {
    if (mountedRef.current) {
      if (!cooldownRef.current && options.leading) {
        cooldownRef.current = true;
        setValue(value);
      } else {
        cancel();
        timeoutRef.current = setTimeout(() => {
          cooldownRef.current = false;
          setValue(value);
        }, wait);
      }
    }
  }, [value, options.leading, wait]);

  useEffect(() => {
    mountedRef.current = true;
    return cancel;
  }, []);

  return [_value, cancel] as const;
};
