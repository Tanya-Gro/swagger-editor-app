export const MuiInputLabel = {
  styleOverrides: {
    root: {
      color: 'var(--color-text-secondary)',
      '&.Mui-focused': {
        color: 'var(--color-text-secondary)',
      },
    },
  },
};

export const MuiOutlinedInput = {
  styleOverrides: {
    root: {
      color: 'var(--color-text-primary)',
      background: 'color-mix(in srgb, var(--color-surface) var(--opacity-60), transparent)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-border)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-text-muted)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-text-muted)',
        boxShadow: '0 0 0 2px var(--focus-ring-color)',
      },
    },
  },
};
