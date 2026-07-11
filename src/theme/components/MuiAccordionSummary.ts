export const MuiAccordionSummary = {
  styleOverrides: {
    root: {
      padding: 0,

      '& .MuiAccordionSummary-content': {
        margin: 0,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '5px',
      },

      '& .MuiAccordionSummary-expandIconWrapper': {
        color: 'var(--color-primary)',
        alignSelf: 'flex-start',
      },
    },
  },
};
