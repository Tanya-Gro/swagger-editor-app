export const MuiIconButton = {
  styleOverrides: {
    root: {
      color: 'var(--color-text-secondary)',
      transition: 'background-color 0.2s ease, color 0.2s ease',
      '&:hover': {
        color: 'var(--color-text-primary)',
        backgroundColor: 'var(--color-border)',
      },
    },
  },
};
