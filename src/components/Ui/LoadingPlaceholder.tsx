import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';

function LoadingPlaceholder() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress />
    </Box>
  );
}

export default LoadingPlaceholder;
