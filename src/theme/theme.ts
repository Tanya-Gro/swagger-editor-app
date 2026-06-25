import { createTheme } from '@mui/material/styles';
import { MuiButton } from './components/MuiButton';
import { MuiIconButton } from './components/MuiIconButton';
import { MuiOutlinedInput } from './components/MuiOutlinedInput';
import { MuiInputLabel } from './components/MuiInputLabel';
import { MuiToggleButton, MuiToggleButtonGroup } from './components/MuiToggleButton';

export const theme = createTheme({
  components: {
    MuiButton,
    MuiIconButton,
    MuiOutlinedInput,
    MuiInputLabel,
    MuiToggleButton,
    MuiToggleButtonGroup,
  },
});
