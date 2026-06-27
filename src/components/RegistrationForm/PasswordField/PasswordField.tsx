import { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslations } from 'next-intl';

type PasswordFieldProps = {
  label: string;
  id: string;
  name: string;
  error?: string;
};

export function PasswordField({ label, id, name, error }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations('REGISTRATION_PAGE');

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
      helperText={error ?? t('passwordHelperText')}
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
