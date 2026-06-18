"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface NavColorContextValue {
  accentColor: string | null;
  setAccentColor: (color: string | null) => void;
}

const NavColorContext = createContext<NavColorContextValue>({
  accentColor: null,
  setAccentColor: () => {},
});

export function NavColorProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColorState] = useState<string | null>(null);

  const setAccentColor = useCallback((color: string | null) => {
    setAccentColorState(color);
  }, []);

  return (
    <NavColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </NavColorContext.Provider>
  );
}

export function useNavColor() {
  return useContext(NavColorContext);
}
