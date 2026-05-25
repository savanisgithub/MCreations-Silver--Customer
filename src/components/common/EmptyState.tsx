import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
    message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
    return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">{message}</Typography>
        </Box>
    );
}