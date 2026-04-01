import { createTheme } from "@mui/material/styles";
 
const sharedComponents = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: "#F4F1EC",
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableRipple: true,
      variant: "contained",
    },
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: 10,
        fontWeight: 600,
        boxShadow: "none",
        paddingInline: "14px",
        paddingBlock: "8px",
      },
      contained: {
        backgroundColor: "#6F5A45",
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: "#5E4B3A",
          boxShadow: "none",
        },
      },
      outlined: {
        borderColor: "rgba(111, 90, 69, 0.35)",
        color: "#6F5A45",
        backgroundColor: "transparent",
        "&:hover": {
          borderColor: "#6F5A45",
          backgroundColor: "rgba(111, 90, 69, 0.05)",
        },
      },
      text: {
        color: "#6F5A45",
        "&:hover": {
          backgroundColor: "rgba(111, 90, 69, 0.05)",
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: "#F4F1EC",
        color: "#1A1A1A",
        boxShadow: "none",
        borderBottom: "1px solid rgba(111, 90, 69, 0.16)",
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: "small",
    },
  },
};
 
const baseTheme = {
  typography: {
    fontFamily: "'Inter Tight', sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
};
 
export const softLightTheme = createTheme({
  ...baseTheme,
  components: {
    ...sharedComponents,
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1A1A1A",
          "& fieldset": {
            borderColor: "rgba(111, 90, 69, 0.2)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(111, 90, 69, 0.4)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#6F5A45",
          },
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#6F5A45",
      dark: "#5E4B3A",
      light: "#8A725A",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#DCCFC1",
      dark: "#C7B6A4",
      light: "#EEE6DD",
      contrastText: "#1A1A1A",
    },
    background: {
      default: "#F4F1EC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#6F5A45",
    },
    divider: "rgba(111, 90, 69, 0.16)",
    success: { main: "#5E8B63" },
    warning: { main: "#C28C4A" },
    error: { main: "#B65A4E" },
    info: { main: "#8A725A" },
  },
});
 
export const darkTheme = createTheme({
  ...baseTheme,
  components: {
    ...sharedComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#1F1A16",
        },
      },
    },
    MuiButton: {
      ...sharedComponents.MuiButton,
      styleOverrides: {
        ...sharedComponents.MuiButton.styleOverrides,
        contained: {
          backgroundColor: "#A8865E",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#8A6E4C",
            boxShadow: "none",
          },
        },
        outlined: {
          borderColor: "rgba(168, 134, 94, 0.35)",
          color: "#A8865E",
          backgroundColor: "transparent",
          "&:hover": {
            borderColor: "#A8865E",
            backgroundColor: "rgba(168, 134, 94, 0.08)",
          },
        },
        text: {
          color: "#A8865E",
          "&:hover": {
            backgroundColor: "rgba(168, 134, 94, 0.08)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1F1A16",
          color: "#F5F0EA",
          boxShadow: "none",
          borderBottom: "1px solid rgba(168, 134, 94, 0.16)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#2A221C",
          color: "#F5F0EA",
          "& fieldset": {
            borderColor: "rgba(168, 134, 94, 0.2)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(168, 134, 94, 0.4)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#A8865E",
          },
          "& input": {
            color: "#F5F0EA",
          },
          "& .MuiSelect-select": {
            color: "#F5F0EA",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#C4A47E",
          "&.Mui-focused": {
            color: "#A8865E",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#F5F0EA",
          "&:hover": {
            backgroundColor: "rgba(168, 134, 94, 0.1)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(168, 134, 94, 0.16)",
            "&:hover": {
              backgroundColor: "rgba(168, 134, 94, 0.22)",
            },
          },
        },
      },
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#A8865E",
      dark: "#8A6E4C",
      light: "#C4A47E",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#6F5A45",
      light: "#8A725A",
      dark: "#4E3F31",
      contrastText: "#F5F0EA",
    },
    background: {
      default: "#1F1A16",
      paper: "#2A241F",
    },
    text: {
      primary: "#F5F0EA",
      secondary: "#C4A47E",
    },
    divider: "rgba(200, 175, 145, 0.14)",
    success: { main: "#7FB187" },
    warning: { main: "#D19A57" },
    error: { main: "#D47A70" },
    info: { main: "#CBB49D" },
  },
});