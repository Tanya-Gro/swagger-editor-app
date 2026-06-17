import { createTheme } from '@mui/material/styles';
import { MuiButton } from './components/MuiButton';
import { MuiIconButton } from './components/MuiIconButton';
import { MuiOutlinedInput } from './components/MuiOutlinedInput';
import { MuiInputLabel } from './components/MuiInputLabel';

export const theme = createTheme({
  components: {
    MuiButton,
    MuiIconButton,
    MuiOutlinedInput,
    MuiInputLabel,
  },
});
