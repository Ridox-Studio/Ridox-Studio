"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const MINIMAL_MODE_KEY = "ridox_minimal_mode";

type MotionPrefs = {
  /** Low-bandwidth mode — Section 12.3. Kills Lenis, marquees, cursor effects. */
  minimal: boolean;
  /** True once the device has been probed for a real pointer. */
  hasPointer: boolean;
  enableMinimalMode: () => void;
  disableMinimalMode: () => void;
};

const MotionContext = createContext<MotionPrefs>({
  minimal: false,
  hasPointer: false,
  enableMinimalMode: () => {},
  disableMinimalMode: () => {},
});

export function MotionProvider({ children }: { children: React.ReactNode }) {
  // Always false on the server so SSR markup matches the first client paint;
  // the real value is read from localStorage in the effect below.
  const [minimal, setMinimal] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    try {
      setMinimal(window.localStorage.getItem(MINIMAL_MODE_KEY) === "true");
    } catch {
      // Private mode / storage disabled — stay on the full experience.
    }
    setHasPointer(window.matchMedia("(hover: hover)").matches);
  }, []);

  const write = useCallback((value: boolean) => {
    setMinimal(value);
    try {
      window.localStorage.setItem(MINIMAL_MODE_KEY, String(value));
    } catch {
      // Ignore — the in-memory flag still applies for this session.
    }
  }, []);

  const enableMinimalMode = useCallback(() => write(true), [write]);
  const disableMinimalMode = useCallback(() => write(false), [write]);

  return (
    <MotionContext.Provider
      value={{ minimal, hasPointer, enableMinimalMode, disableMinimalMode }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionPrefs() {
  return useContext(MotionContext);
}
