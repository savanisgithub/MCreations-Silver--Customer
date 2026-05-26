import { Box, Card, CardContent, Skeleton } from '@mui/material';

export default function ProductCardSkeleton() {
    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid #E5E7EB',
                borderRadius: 4,
                overflow: 'hidden',
            }}
        >
            <Skeleton variant="rectangular" height={260} />

            <CardContent>
                <Skeleton width="80%" height={30} />
                <Skeleton width="55%" height={22} />
                <Box sx={{ mt: 1 }}>
                    <Skeleton width="40%" height={28} />
                </Box>
            </CardContent>
        </Card>
    );
}