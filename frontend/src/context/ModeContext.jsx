// src/context/ModeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setModeState] = useState(
    localStorage.getItem("mode") || "real"
  );

  const setMode = (newMode) => {
    setModeState(newMode);
    localStorage.setItem("mode", newMode);
  };

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
