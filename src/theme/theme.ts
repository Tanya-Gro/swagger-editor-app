import { createTheme } from '@mui/material/styles';
import { MuiButton } from './components/MuiButton';
import { MuiIconButton } from './components/MuiIconButton';
import { MuiOutlinedInput } from './components/MuiOutlinedInput';
import { MuiInputLabel } from './components/MuiInputLabel';
import { MuiToggleButton, MuiToggleButtonGroup } from './components/MuiToggleButton';
import { MuiChip } from './components/MuiChip';
import { MuiPaper } from './components/MuiPaper';
import { MuiTable, MuiTableCell, MuiTableRow } from './components/MuiTable';

export const theme = createTheme({
  components: {
    MuiButton,
    MuiChip,
    MuiIconButton,
    MuiOutlinedInput,
    MuiInputLabel,
    MuiPaper,
    MuiTable,
    MuiTableCell,
    MuiTableRow,
    MuiToggleButton,
    MuiToggleButtonGroup,
  },
});
