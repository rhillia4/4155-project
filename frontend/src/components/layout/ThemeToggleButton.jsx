// frontend/src/components/layout/ThemeToggleButton.jsx
import React, { useContext } from "react";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ThemeContext } from "../../context/ThemeContext.jsx";

export default function ThemeToggleButton() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <IconButton onClick={toggleDarkMode} color="inherit">
      {darkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}