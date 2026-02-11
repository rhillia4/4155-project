import { createTheme } from '@mui/material/styles';

const baseTheme = {
  typography: {
    fontFamily: "'Inter Tight', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        :root {
          --topbar-height: 64px;
          --topbar-height-mobile: 56px;
        }
      `,
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        variant: 'contained',
        textDecoration: "none",
      },
      styleOverrides: {
        root: {
          whiteSpace: 'nowrap',
          textTransform: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // AppBar background will be set per theme below
        },
      },
    },
  },
};

// export const lightTheme = createTheme({
//   ...baseTheme,
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#9AA6B2', // Sky Blue
//       dark: '#BCCCDC', // Royal Blue
//       light: '#D9EAFD', // Non-Photo Blue
//     },
//     secondary: {
//       main: '#0e6ba8', // Bice Blue
//       light: '#b0d4f1', // Powder Blue
//     },
//     background: {
//       default: '#F8FAFC', // Alice Blue
//       paper: '#D0CDD7',
        
//     },
//     text: {
//       primary: '#00072d', // Oxford Blue
//       secondary: '#001c55', // Dark Blue
//     },
//     success: { main: '#7fff00' }, // Lime Green
//     warning: { main: '#ff9f43' }, // Tangerine
//     error: { main: '#ff6f61' }, // Coral
//     info: { main: '#a6e1fa' }, // Non-Photo Blue
//   },
// });

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4da6ff', // Sky Blue
      dark: '#0a2472', // Royal Blue
      light: '#a6e1fa', // Non-Photo Blue
    },
    secondary: {
      main: '#0e6ba8', // Bice Blue
      light: '#b0d4f1', // Powder Blue
    },
    background: {
      default: '#00072d', // Oxford Blue
      paper: '#001c55', // Dark Blue
    },
    text: {
      primary: '#f0f8ff', // Alice Blue
      secondary: '#b0d4f1', // Powder Blue
    },
    success: { main: '#7fff00' }, // Lime Green
    warning: { main: '#ff9f43' }, // Tangerine
    error: { main: '#ff6f61' }, // Coral
    info: { main: '#a6e1fa' }, // Non-Photo Blue
  },
});
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4da6ff', // Sky Blue
      dark: '#0a2472', // Royal Blue
      light: '#a6e1fa', // Non-Photo Blue
    },
    secondary: {
      main: '#0e6ba8', // Bice Blue
      light: '#b0d4f1', // Powder Blue
    },
    background: {
      default: '#00072d', // Oxford Blue
      paper: '#001c55', // Dark Blue
    },
    text: {
      primary: '#f0f8ff', // Alice Blue
      secondary: '#b0d4f1', // Powder Blue
    },
    success: { main: '#7fff00' }, // Lime Green
    warning: { main: '#ff9f43' }, // Tangerine
    error: { main: '#ff6f61' }, // Coral
    info: { main: '#a6e1fa' }, // Non-Photo Blue
  },
});
