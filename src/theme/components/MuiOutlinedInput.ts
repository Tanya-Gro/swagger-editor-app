export const MuiOutlinedInput = {
  styleOverrides: {
    root: {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-border)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-primary-hover)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-primary)',
      },
    },
    input: {
      height: '56px',
    },
  },
};
