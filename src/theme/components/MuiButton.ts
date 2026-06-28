export const MuiButton = {
  styleOverrides: {
    root: {
      minHeight: 34,
      padding: '6px 12px',
      borderRadius: 'var(--border-radius-s)',
      fontSize: 'var(--font-size-m)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 'var(--line-height-tight)',
      textTransform: 'none',
      transition: 'background 0.2s ease, box-shadow 0.2s ease, color 0.2s ease',
    },
    text: {
      color: 'var(--color-text-secondary)',
      '&:hover': {
        color: 'var(--color-text-primary)',
        backgroundColor: 'var(--color-border)',
      },
    },
    contained: {
      color: 'var(--color-text-inverse)',
      background: 'var(--gradient-button-primary)',
      boxShadow: '0 4px 6px var(--shadow-color)',
      '&:hover': {
        background: 'var(--gradient-button-primary-hover)',
        boxShadow: '0 4px 6px var(--shadow-color)',
      },
    },
    outlined: {
      borderColor: 'var(--color-border)',
      color: 'var(--color-text-secondary)',
      background: 'color-mix(in srgb, var(--color-surface) 50%, transparent)',
      '&:hover': {
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-primary)',
        background: 'var(--color-background)',
      },
    },
    sizeSmall: {
      minHeight: 28,
      padding: '4px 12px',
      fontSize: 'var(--font-size-xs)',
    },
  },
};
