import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#f6f8fb',
          paper: '#ffffff',
        },
        primary: {
          main: '#0f766e',
        },
        secondary: {
          main: '#172033',
        },
      },
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: ['Arial', 'Helvetica', 'sans-serif'].join(','),
  },
});
