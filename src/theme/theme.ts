import { createTheme } from '@mui/material/styles';
import { MuiAccordion, MuiAccordionDetails, MuiAccordionSummary } from './components/MuiAccordion';
import { MuiButton } from './components/MuiButton';
import { MuiChip } from './components/MuiChip';
import { MuiIconButton } from './components/MuiIconButton';
import { MuiInputLabel, MuiOutlinedInput } from './components/MuiTextField';

export const theme = createTheme({
  components: {
    MuiAccordion,
    MuiAccordionDetails,
    MuiAccordionSummary,
    MuiButton,
    MuiChip,
    MuiIconButton,
    MuiInputLabel,
    MuiOutlinedInput,
  },
});
