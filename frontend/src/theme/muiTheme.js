import { createTheme } from "@mui/material/styles";

const baseTheme = {
  typography: {
    fontFamily: "'Inter Tight', sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
  components: {
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
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
};

export const softLightTheme = createTheme({
  ...baseTheme,
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
    success: {
      main: "#5E8B63",
    },
    warning: {
      main: "#C28C4A",
    },
    error: {
      main: "#B65A4E",
    },
    info: {
      main: "#8A725A",
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#CBB49D",
      dark: "#A88C72",
      light: "#E4D7CA",
      contrastText: "#1A1A1A",
    },
    secondary: {
      main: "#6F5A45",
      light: "#8A725A",
      dark: "#4E3F31",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#1F1A16",
      paper: "#2A241F",
    },
    text: {
      primary: "#F5F0EA",
      secondary: "#D7C8B8",
    },
    divider: "rgba(244, 241, 236, 0.12)",
    success: {
      main: "#7FB187",
    },
    warning: {
      main: "#D19A57",
    },
    error: {
      main: "#D47A70",
    },
    info: {
      main: "#CBB49D",
    },
  },
});