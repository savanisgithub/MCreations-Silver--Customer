import { Box, CircularProgress } from '@mui/material';

interface PageLoadingProps {
    minHeight?: number | string;
}

export default function PageLoading({ minHeight = 300 }: PageLoadingProps) {
    return (
        <Box
            sx={{
                minHeight,
                display: 'grid',
                placeItems: 'center',
            }}
        >
            <CircularProgress />
        </Box>
    );
}