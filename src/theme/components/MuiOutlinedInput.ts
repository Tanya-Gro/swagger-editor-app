export const MuiOutlinedInput = {
  styleOverrides: {
    root: {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--border-radius-l)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-primary-hover)',
      },

      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-primary)',
      },

      '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-error)',
      },
    },
    input: {
      height: '56px',
    },
  },
};
