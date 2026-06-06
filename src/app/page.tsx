import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <Box component="main" className="shell">
      <Paper className="intro" elevation={0}>
        <Stack spacing={3}>
          <Chip color="primary" label="RS School React 2026 Q2" sx={{ alignSelf: 'flex-start', fontWeight: 700 }} />
          <Typography component="h1" variant="h1">
            Swagger Editor App
          </Typography>
          <Typography className="lead" component="p">
            Next.js, React, and TypeScript are ready. Start building the editor experience in{' '}
            <code>src/app/page.tsx</code>.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
