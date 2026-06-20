export const MuiAccordion = {
  styleOverrides: {
    root: {
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 'var(--border-radius-m)',
      color: 'var(--color-text-primary)',
      background: 'color-mix(in srgb, var(--color-surface) var(--opacity-80), transparent)',
      boxShadow: 'none',
      transition: 'box-shadow 0.3s ease',
      '&::before': {
        display: 'none',
      },
      '&:hover': {
        boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--color-shadow) var(--opacity-10), transparent)',
      },
      '&.Mui-expanded': {
        margin: 0,
      },
    },
  },
};

export const MuiAccordionSummary = {
  styleOverrides: {
    root: {
      minHeight: 0,
      padding: 16,
      '@media (width <= 480px)': {
        padding: 12,
      },
      '&.Mui-expanded': {
        minHeight: 0,
      },
    },
    content: {
      margin: 0,
      '&.Mui-expanded': {
        margin: 0,
      },
    },
    expandIconWrapper: {
      color: 'var(--color-text-muted)',
    },
  },
};

export const MuiAccordionDetails = {
  styleOverrides: {
    root: {
      margin: '0 16px',
      padding: '16px 0',
      borderTop: '1px solid var(--color-border)',
    },
  },
};
