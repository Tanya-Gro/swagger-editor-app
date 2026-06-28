export const MuiToggleButton = {
  styleOverrides: {
    root: {
      minHeight: 28,
      padding: '4px 10px',
      borderColor: 'var(--color-border)',
      borderRadius: 'var(--border-radius-s)',
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 'var(--line-height-tight)',
      color: 'var(--color-text-secondary)',
      textTransform: 'none',
      background: 'color-mix(in srgb, var(--color-surface) 50%, transparent)',
      '&:hover': {
        color: 'var(--color-text-primary)',
        background: 'var(--color-background)',
      },
      '&.Mui-selected': {
        color: 'var(--color-text-inverse)',
        background: 'var(--gradient-button-primary)',
      },
      '&.Mui-selected:hover': {
        color: 'var(--color-text-inverse)',
        background: 'var(--gradient-button-primary-hover)',
      },
    },
  },
};

export const MuiToggleButtonGroup = {
  styleOverrides: {
    grouped: {
      borderColor: 'var(--color-border)',
    },
  },
};
