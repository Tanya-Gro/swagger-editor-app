export const MuiPaper = {
  styleOverrides: {
    root: {
      borderColor: 'var(--color-border)',
      borderRadius: 'var(--border-radius-m)',
      background: 'color-mix(in srgb, var(--color-surface) 78%, transparent)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 10px 28px color-mix(in srgb, var(--color-text-primary) var(--opacity-10), transparent)',
    },
    outlined: {
      borderColor: 'var(--color-border)',
    },
  },
};
