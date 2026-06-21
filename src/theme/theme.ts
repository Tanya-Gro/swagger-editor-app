import { createTheme } from '@mui/material/styles';
import { MuiButton } from './components/MuiButton';
import { MuiIconButton } from './components/MuiIconButton';
import { MuiOutlinedInput } from './components/MuiOutlinedInput';

export const theme = createTheme({
  components: {
    MuiButton,
    MuiIconButton,
    MuiOutlinedInput,
  },
});
