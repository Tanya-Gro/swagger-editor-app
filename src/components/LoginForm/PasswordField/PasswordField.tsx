import { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type PasswordFieldProps = {
  label: string;
  id: string;
  name: string;
  helperText: string;
  error?: string;
};

export function PasswordField({ label, id, name, helperText, error }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      label={label}
      id={id}
      name={name}
      type={showPassword ? 'text' : 'password'}
      variant="outlined"
      fullWidth
      margin="normal"
      error={Boolean(error)}
      helperText={error ?? helperText}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
                onMouseDown={(event) => event.preventDefault()}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      autoComplete="current-password"
    />
  );
}
