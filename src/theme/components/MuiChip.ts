export const MuiChip = {
  styleOverrides: {
    root: {
      minHeight: 24,
      borderRadius: 'var(--border-radius-pill)',
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-bold)',
      lineHeight: 1,
    },
    sizeSmall: {
      height: 24,
      padding: '0 2px',
    },
    labelSmall: {
      paddingInline: 8,
    },
    colorSuccess: {
      borderColor: '#a7f3d0',
      color: '#047857',
      background: '#d1fae5',
    },
    colorWarning: {
      borderColor: '#fde68a',
      color: '#b45309',
      background: '#fef3c7',
    },
    outlined: {
      borderWidth: 1,
      borderStyle: 'solid',
    },
    colorPrimary: {
      borderColor: '#bfdbfe',
      color: '#1d4ed8',
      background: '#dbeafe',
      '&.method-get': {
        borderColor: '#bae6fd',
        color: '#0369a1',
        background: '#e0f2fe',
      },
      '&.method-post': {
        borderColor: '#bbf7d0',
        color: '#15803d',
        background: '#dcfce7',
      },
      '&.method-put': {
        borderColor: '#fed7aa',
        color: '#c2410c',
        background: '#ffedd5',
      },
    },
    colorError: {
      borderColor: '#fecdd3',
      color: '#be123c',
      background: '#ffe4e6',
      '&.method-delete': {
        borderColor: '#fecaca',
        color: '#b91c1c',
        background: '#fee2e2',
      },
    },
  },
};
