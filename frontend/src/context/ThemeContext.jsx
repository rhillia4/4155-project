import React, { createContext, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { softLightTheme, darkTheme } from "../theme/muiTheme.js";

export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

export function ThemeContextProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", JSON.stringify(next));
      return next;
    });
  };

  const theme = useMemo(
    () => (darkMode ? darkTheme : softLightTheme),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}