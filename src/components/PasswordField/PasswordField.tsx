import { useState, useId } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

type PasswordFieldProps = {
  label: string;
  name: string;
  helperText: string;
  error?: string;
};

export function PasswordField({ label, name, helperText, error }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  const t = useTranslations('PASSWORD');

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
                aria-label={showPassword ? t('hidePasswordButtonLabel') : t('showPasswordButtonLabel')}
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
