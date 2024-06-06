import { useEffect, useState } from "react";

export function useDebounceEffect<T>(
  // fn: () => void,
  value: T,
  waitTime?: 2000
  // deps?: DependencyList
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      // fn.apply(undefined);
      setDebouncedValue(value);
    }, waitTime);

    return () => {
      clearTimeout(timeOut);
    };
  }, [value, waitTime]);

  return debouncedValue;
}
