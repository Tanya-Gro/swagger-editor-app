export const MuiAccordion = {
  defaultProps: {
    disableGutters: true,
    elevation: 0,
  },

  styleOverrides: {
    root: {
      padding: '16px',
      border: '1px solid var(--color-border-subtle)',
      transition: 'box-shadow 0.15s ease-in-out',

      '&:hover': {
        boxShadow: '0 8px 10px rgb(0 0 0 / 12%)',
      },
    },
    rounded: {
      borderRadius: 'var(--border-radius-s)',

      '&:first-of-type': {
        borderRadius: 'var(--border-radius-s)',
      },

      '&:last-of-type': {
        borderRadius: 'var(--border-radius-s)',
      },
    },
  },
};
