import { useEffect, useState } from "react";

export function useSafeLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      setValue(JSON.parse(item));
    }
  }, [key]);

  useEffect(() => {
    if (value) { 
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value || defaultValue, setValue] as const;
}