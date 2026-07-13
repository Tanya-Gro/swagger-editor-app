export const MuiTable = {
  styleOverrides: {
    root: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    },
  },
};

export const MuiTableCell = {
  styleOverrides: {
    root: {
      padding: '18px 24px',
      borderBottom: '1px solid var(--color-border-subtle)',
      fontSize: 'var(--font-size-s)',
      lineHeight: 'var(--line-height-normal)',
      color: 'var(--color-text-primary)',
      textAlign: 'left' as const,
      verticalAlign: 'middle' as const,
      '@media (width <= 640px)': {
        padding: '14px 16px',
      },
    },
    head: {
      color: 'var(--color-text-secondary)',
      fontWeight: 'var(--font-weight-bold)',
      textTransform: 'uppercase',
      background: 'color-mix(in srgb, var(--color-border-subtle) 78%, transparent)',
    },
  },
};

export const MuiTableRow = {
  styleOverrides: {
    root: {
      '&:last-child .MuiTableCell-root': {
        borderBottom: 0,
      },
    },
  },
};
