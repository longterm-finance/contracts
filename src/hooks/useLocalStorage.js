import { useState, useEffect } from "react";

function getSavedValue(key, initialValue) {
  const storedValue = JSON.parse(localStorage.getItem(key));
  if (storedValue) return storedValue;
  if (initialValue instanceof Function) return initialValue();
  return initialValue;
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
    // eslint-disable-next-line
  }, [value]);

  return [value, setValue];
}
