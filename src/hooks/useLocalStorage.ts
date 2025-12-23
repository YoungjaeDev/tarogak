"use client";

import { useEffect, useState } from "react";

type SetValue<T> = T | ((prev: T) => T);

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error("로컬스토리지 읽기 실패:", error);
    }
  }, [key]);

  const setValue = (value: SetValue<T>) => {
    setStoredValue((prev) => {
      const nextValue = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      } catch (error) {
        console.error("로컬스토리지 저장 실패:", error);
      }
      return nextValue;
    });
  };

  return [storedValue, setValue];
}
