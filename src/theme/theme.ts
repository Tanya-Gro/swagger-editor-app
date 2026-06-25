import { createTheme } from '@mui/material/styles';
import { MuiButton } from './components/MuiButton';
import { MuiIconButton } from './components/MuiIconButton';
import { MuiToggleButton, MuiToggleButtonGroup } from './components/MuiToggleButton';

export const theme = createTheme({
  components: {
    MuiButton,
    MuiIconButton,
    MuiToggleButton,
    MuiToggleButtonGroup,
  },
});
