import * as React from "react";
import { Storage } from "@/lib/storage";

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = React.useState<T>(defaultValue);

  React.useEffect(() => {
    const stored = Storage.get<T>(key, defaultValue);
    setValue(stored);
  }, [key, defaultValue]);

  const update = (newValue: T) => {
    setValue(newValue);
    Storage.set(key, newValue);
  };

  const remove = () => {
    setValue(defaultValue);
    Storage.remove(key);
  };

  return [value, update, remove] as const;
}
